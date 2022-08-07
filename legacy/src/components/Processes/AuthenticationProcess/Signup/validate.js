/**
 * This is the validate function for Signup Component
 *
 * Date: August 1st 2020
 *
 * @param {*} vals
 */

export const validate = (vals) => {
	const errors = {};
	errors.email = [];
	errors.emailAgain = [];
	errors.password = [];
	errors.passwordAgain = [];

	if (!vals.email) {
		errors.email = [...errors.email, "Email should not be empty"];
	}
	if (!vals.emailAgain) {
		errors.emailAgain = [...errors.emailAgain, "Email should not be empty"];
	}

	if (vals.email !== vals.emailAgain) {
		errors.email = [...errors.email, "Emails don't match"];
	}

	if (!vals.password) {
		errors.password = [...errors.password, "Password should not be empty"];
	}

	if (!vals.passwordAgain) {
		errors.passwordAgain = [
			...errors.passwordAgain,
			"Password should not be empty",
		];
	}

	// let regNumber = /[0-9]/;
	// let regUpper = /[A-Z]/;
	// let regSpecial = /[!@#$%^&*(),.?":{}|<>]/;

	// if (!regUpper.test(vals.password)) {
	//   errors.password = [...errors.password, "Password must contain at least ONE uppercase letter"];
	// }

	// if (!regSpecial.test(vals.password)) {
	//   errors.password = [...errors.password, "Password must contain at least ONE special character"];
	// }

	// if (!regNumber.test(vals.password)) {
	//     errors.password = [...errors.password, "Password must contain at least ONE number"];
	// }

	if (vals.password && vals.password.length < 8) {
		errors.password = [
			...errors.password,
			"Password needs to be at least 8 characters long",
		];
	}

	if (vals.password !== vals.passwordAgain) {
		errors.password = [...errors.password, "Passwords don't match!"];
	}

	if (
		errors.email.length < 1 &&
		errors.emailAgain.length < 1 &&
		errors.password.length < 1 &&
		errors.passwordAgain.length < 1
	) {
		return {};
	}

	return errors;
};
