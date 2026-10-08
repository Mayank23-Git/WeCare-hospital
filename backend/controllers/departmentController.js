const { getAllDepartments, getDepartmentById, getAllDoctors } = require('../services/dataService');

/**
 * @route   GET /api/departments
 * @desc    Get all hospital departments with doctor count
 */
const getDepartments = async (req, res, next) => {
  try {
    const departments = await getAllDepartments();
    const doctors = await getAllDoctors();

    // Enrich each department with doctor count and member doctors
    const enriched = departments.map((dept) => {
      const deptObj = dept.toObject ? dept.toObject() : { ...dept };
      const deptDoctors = doctors.filter(
        (doc) =>
          doc.departmentId === deptObj.departmentId ||
          doc.department.toLowerCase() === deptObj.name.toLowerCase()
      );
      return {
        ...deptObj,
        doctorCount: deptDoctors.length,
        doctors: deptDoctors,
      };
    });

    res.json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/departments/:id
 * @desc    Get single department by departmentId
 */
const getDepartment = async (req, res, next) => {
  try {
    const department = await getDepartmentById(req.params.id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: `Department with ID '${req.params.id}' was not found.`,
      });
    }

    const deptObj = department.toObject ? department.toObject() : { ...department };
    const doctors = await getAllDoctors({ department: deptObj.departmentId });

    res.json({
      success: true,
      data: {
        ...deptObj,
        doctorCount: doctors.length,
        doctors,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDepartments,
  getDepartment,
};
