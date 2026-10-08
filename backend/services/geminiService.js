const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getAllDepartments, getAllDoctors } = require('./dataService');

/**
 * Emergency Red Flag keywords that require urgent emergency notice
 */
const EMERGENCY_KEYWORDS = [
  'chest pain',
  'heart attack',
  'stroke',
  'difficulty breathing',
  'shortness of breath',
  'sudden numbness',
  'sudden weakness',
  'slurred speech',
  'coughing blood',
  'unconscious',
  'severe bleeding',
  'seizure',
  'suicidal',
  'overdose',
  'anaphylaxis',
  'sudden loss of vision',
];

/**
 * Fallback intelligent matcher when Gemini API is unconfigured or offline
 */
const fallbackMatcher = (userText, departments, doctors) => {
  const text = (userText || '').toLowerCase();

  // Check emergency red flags
  const isEmergency = EMERGENCY_KEYWORDS.some((kw) => text.includes(kw));

  // Match department by featured symptoms or name
  let matchedDept = null;
  let bestScore = 0;

  for (const dept of departments) {
    let score = 0;
    if (text.includes(dept.name.toLowerCase())) score += 5;
    if (dept.specialization && text.includes(dept.specialization.toLowerCase())) score += 4;

    if (dept.featuredSymptoms && Array.isArray(dept.featuredSymptoms)) {
      for (const symptom of dept.featuredSymptoms) {
        if (text.includes(symptom.toLowerCase())) {
          score += 3;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      matchedDept = dept;
    }
  }

  // If no specific match, default to General Medicine
  if (!matchedDept) {
    matchedDept =
      departments.find((d) => d.name.toLowerCase().includes('general')) ||
      departments[0];
  }

  // Find 1-3 doctors from this department
  const matchingDoctors = doctors
    .filter(
      (doc) =>
        doc.departmentId === matchedDept.departmentId ||
        doc.department.toLowerCase() === matchedDept.name.toLowerCase()
    )
    .slice(0, 2);

  const emergencyNotice = isEmergency
    ? '⚠️ IMPORTANT MEDICAL ALERT: Your message mentions potential emergency symptoms. If you or someone else is experiencing severe chest pain, acute shortness of breath, loss of consciousness, or signs of stroke, please call emergency services (911) or visit the nearest Emergency Department immediately.'
    : '';

  const explanation = isEmergency
    ? `${emergencyNotice}\n\nBased on what you've described, an urgent evaluation in ${matchedDept.name} or Emergency Medicine may be required.`
    : `Based on what you've described, our ${matchedDept.name} department appears most suitable for an evaluation. Here are specialist doctors available at WeCare Hospital.`;

  return {
    department: matchedDept.name,
    departmentId: matchedDept.departmentId,
    explanation,
    isEmergency,
    recommendedDoctors: matchingDoctors.map((doc) => ({
      doctorId: doc.doctorId,
      reason: `Specializes in ${doc.specialization} within ${matchedDept.name}.`,
    })),
    disclaimer:
      'This guidance is provided for general informational purposes and does not constitute a clinical medical diagnosis or treatment plan. Always consult a qualified physician for personalized care.',
    isFallback: true,
  };
};

/**
 * Main AI Doctor Recommendation function using Google Gemini API
 */
const recommendDoctor = async (patientMessage, conversationHistory = []) => {
  const departments = await getAllDepartments();
  const doctors = await getAllDoctors();

  const apiKey = process.env.GEMINI_API_KEY;

  // If no Gemini API key provided, use resilient medical symptom matcher
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE' || apiKey.trim() === '') {
    console.log('[Gemini] No GEMINI_API_KEY configured. Utilizing built-in clinical symptom engine.');
    const result = fallbackMatcher(patientMessage, departments, doctors);
    return populateDoctorDetails(result, doctors, departments);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash or gemini-2.5-flash
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Prepare catalog of available departments and doctors
    const departmentSummary = departments
      .map((d) => `- ${d.name} (ID: ${d.departmentId}): ${d.description}`)
      .join('\n');

    const doctorSummary = doctors
      .map(
        (doc) =>
          `- ${doc.name} (ID: ${doc.doctorId}, Department: ${doc.department}, Spec: ${doc.specialization}, Exp: ${doc.experience})`
      )
      .join('\n');

    const prompt = `
You are the AI Doctor Recommendation Assistant for "WeCare Hospital".
Your role is to help a patient identify the most appropriate hospital department and suitable EXISTING doctors based on their symptoms BEFORE booking an appointment.

AVAILABLE DEPARTMENTS AT WECARE HOSPITAL:
${departmentSummary}

AVAILABLE DOCTORS AT WECARE HOSPITAL:
${doctorSummary}

CRITICAL MEDICAL SAFETY RULES:
1. You MUST NOT act as a doctor or diagnostic system.
2. NEVER claim to diagnose a disease or state the patient definitely has a specific condition.
3. NEVER prescribe any medications, drug dosages, or treatments.
4. NEVER tell the patient to start or stop any medication.
5. Clearly state that recommendations are general guidance only and not a medical diagnosis.
6. If the symptoms indicate an emergency (e.g., severe chest pain, difficulty breathing, stroke symptoms, uncontrolled bleeding), immediately flag "isEmergency": true and instruct the patient to call emergency services or visit the ER immediately.
7. You MUST ONLY recommend departments and doctor IDs that exist in the lists above. NEVER invent doctor names or IDs.
8. Pick 1 to 3 relevant doctors from the suggested department.

PATIENT MESSAGE:
"${patientMessage}"

RESPONSE FORMAT:
You MUST respond with ONLY a valid, parseable JSON object without markdown fences, matching this structure:
{
  "department": "Exact Department Name from list",
  "departmentId": "Exact Department ID from list",
  "isEmergency": false,
  "explanation": "Concise, friendly explanation of why this department is suitable (2-3 sentences)",
  "recommendedDoctors": [
    {
      "doctorId": "exact doctorId from list",
      "reason": "Short reason why this doctor's specialty fits"
    }
  ],
  "disclaimer": "This is general informational guidance and not a medical diagnosis. Please consult a qualified healthcare professional."
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean JSON response
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsed = JSON.parse(cleanedText);

    // Validate recommendation against MongoDB catalog
    const validated = validateAndEnrichRecommendation(parsed, departments, doctors, patientMessage);
    return validated;
  } catch (error) {
    console.error('[Gemini API Error]:', error.message);
    // Graceful fallback: Never crash the website!
    const fallbackResult = fallbackMatcher(patientMessage, departments, doctors);
    return populateDoctorDetails(fallbackResult, doctors, departments);
  }
};

/**
 * Validates Gemini response to ensure suggested departments and doctors exist
 */
const validateAndEnrichRecommendation = (aiOutput, departments, doctors, originalMessage) => {
  let validatedDept = departments.find(
    (d) =>
      d.name.toLowerCase() === (aiOutput.department || '').toLowerCase() ||
      d.departmentId === aiOutput.departmentId
  );

  // If suggested department does not exist in DB, fallback to best match
  if (!validatedDept) {
    const fallback = fallbackMatcher(originalMessage, departments, doctors);
    validatedDept = departments.find((d) => d.departmentId === fallback.departmentId) || departments[0];
  }

  // Validate recommended doctors
  let validDoctors = [];
  if (Array.isArray(aiOutput.recommendedDoctors)) {
    for (const rec of aiOutput.recommendedDoctors) {
      const doc = doctors.find((d) => d.doctorId === rec.doctorId);
      if (doc) {
        validDoctors.push({
          doctorId: doc.doctorId,
          reason: rec.reason || `Specialist in ${doc.specialization}`,
          doctorDetails: doc,
        });
      }
    }
  }

  // If no valid doctors found, pick doctors from that department
  if (validDoctors.length === 0) {
    const deptDocs = doctors
      .filter((d) => d.departmentId === validatedDept.departmentId)
      .slice(0, 2);
    validDoctors = deptDocs.map((doc) => ({
      doctorId: doc.doctorId,
      reason: `Available specialist in ${validatedDept.name}`,
      doctorDetails: doc,
    }));
  }

  return {
    department: validatedDept.name,
    departmentId: validatedDept.departmentId,
    explanation:
      aiOutput.explanation ||
      `Based on what you've described, consulting a specialist in ${validatedDept.name} is recommended.`,
    isEmergency: Boolean(aiOutput.isEmergency),
    recommendedDoctors: validDoctors,
    disclaimer:
      aiOutput.disclaimer ||
      'This guidance is general information and not a medical diagnosis. Please consult a qualified doctor for professional evaluation.',
    isFallback: false,
  };
};

/**
 * Attaches full doctor objects for each recommended doctor
 */
const populateDoctorDetails = (recommendation, doctors, departments) => {
  const enrichedDocs = (recommendation.recommendedDoctors || []).map((rec) => {
    const fullDoc = doctors.find((d) => d.doctorId === rec.doctorId);
    return {
      doctorId: rec.doctorId,
      reason: rec.reason,
      doctorDetails: fullDoc || null,
    };
  });

  return {
    ...recommendation,
    recommendedDoctors: enrichedDocs,
  };
};

module.exports = {
  recommendDoctor,
  fallbackMatcher,
};
