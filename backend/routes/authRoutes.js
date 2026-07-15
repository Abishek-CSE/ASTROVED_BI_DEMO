import express from 'express';
import User from '../models/User.js';
import RolePermission from '../models/RolePermission.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find active user by email and password
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    if (user.status !== 'Active') {
      return res.status(403).json({ message: 'Your account is deactivated' });
    }

    // Get the permissions for the user's role
    const rolePermission = await RolePermission.findOne({ role: user.role });
    const permissions = rolePermission ? rolePermission.permissions : {
      dashboard: {},
      data: {},
      management: {},
      crud: {}
    };

    // Update last login
    user.lastLogin = new Date().toISOString().replace('T', ' ').substring(0, 16);
    await user.save();

    res.json({
      user: {
        empId: user.empId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation
      },
      permissions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
