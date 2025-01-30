const User = require('../models/userModel');

const handleAdminAction = async (action, payload) => {
    try {
        switch (action) {
            case 'addUser':
                // Example: Adding a new user to the database
                const newUser = new User(payload);
                await newUser.save();
                return { success: true, data: newUser, message: 'User added successfully' };

            case 'deleteUser':
                // Example: Deleting a user by ID
                const deletedUser = await User.findByIdAndDelete(payload.userId);
                if (!deletedUser) {
                    throw new Error('User not found');
                }
                return { success: true, message: 'User deleted successfully' };

            case 'updateRole':
                // Example: Updating user role
                const updatedUser = await User.findByIdAndUpdate(
                    payload.userId,
                    { role: payload.newRole },
                    { new: true }
                );
                if (!updatedUser) {
                    throw new Error('User not found');
                }
                return { success: true, data: updatedUser, message: 'User role updated successfully' };

            case 'viewAllUsers':
                // Example: Fetching all users
                const users = await User.find();
                return { success: true, data: users, message: 'Users retrieved successfully' };

            default:
                throw new Error('Invalid action specified');
        }
    } catch (error) {
        console.error('Error handling admin action:', error);
        throw new Error(error.message || 'Admin action failed');
    }
};

module.exports = { handleAdminAction };
