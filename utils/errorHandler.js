// utils/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error('Error: ', err.message); // Log the error message
    console.error(err.stack); // Log the error stack for debugging

    // Send response with error details
    res.status(500).json({
        success: false,
        message: err.message || 'Server Error',
        details: err.stack, // Optionally include the stack trace in the response
    });
};

module.exports = errorHandler;
