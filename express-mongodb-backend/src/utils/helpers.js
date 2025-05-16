module.exports = {
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    },

    validatePassword: function(password) {
        return password.length >= 6; // Example: minimum length of 6 characters
    },

    formatResponse: function(data, message = 'Success', status = 200) {
        return {
            status,
            message,
            data
        };
    },

    handleError: function(error) {
        return {
            status: 'error',
            message: error.message || 'An error occurred'
        };
    }
};