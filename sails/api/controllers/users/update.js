module.exports = {

  friendlyName: 'Update user',

  description: 'Update data of existing user.',

  inputs: {
    userId: {
      description: 'ID of user to update',
      type: 'number'
    },
    firstName: {
      description: 'New first name',
      type: 'string'
    },
    lastName: {
      description: 'New last name',
      type: 'string'
    },
    userName: {
      description: 'New username',
      type: 'string'
    },
    languagePreference: {
      description: 'Preferred language. Available languages: `en`, `de`',
      type: 'string'
    },
    hideLastName: {
      description: 'Select weather the last name is visible to other users',
      type: 'boolean'
    },
    avatar: {
      description: 'New Avatar. Must be base64 encoded',
      type: 'ref'
    },
    role: {
      description: 'User role within the system.',
      type: 'number'
    }
  },

  exits: {
    success: {
      responseType: '',
      statusCode: 200
    },
    invalidParams: {
      description: 'Invalid parameters',
      statusCode: 400
    },
    nameTaken: {
      description: 'Username already in use',
      statusCode: 409
    },
    nonExistent: {
      description: 'User does not exist',
      statusCode: 404
    },
    unauthorized: {
      description: 'Unauthorized request',
      statusCode: 403
    }
  },

  fn: async function(inputs, exits) {
    let realnameRegex = new RegExp(sails.config.custom.REALNAME_REGEX);
    let usernameRegex = new RegExp(sails.config.custom.USERNAME_REGEX);

    var valuesToChange = {};
    if(inputs.hideLastName !== null && inputs.hideLastName !==  undefined) {
      valuesToChange.hideLastName == inputs.hideLastName;
    }
    if(inputs.languagePreference) {
      if(['en', 'de'].includes(inputs.languagePreference)) {
        valuesToChange.languagePreference = inputs.languagePreference;
      } else {
        return exits.invalidParams({
          error: {
            code: 109,
            message: 'Invalid language preference'
          }
        });
      }
    }
    if(inputs.firstName) {
      if(realnameRegex.test(inputs.firstName)) {
        valuesToChange.firstName = inputs.firstName;
      } else {
        return exits.invalidParams({
          error: {
            code: 107,
            message: 'First name is too short/long or contains illegal characters'
          }
        });
      }
    }
    if(inputs.lastName) {
      if(realnameRegex.test(inputs.lastName)) {
        valuesToChange.lastName = inputs.lastName;
      } else {
        return exits.invalidParams({
          error: {
            code: 106,
            message: 'Last name is too short/long or contains illegal characters'
          }
        });
      }
    }
    if(inputs.userName) {
      if(usernameRegex.test(inputs.userName)) {
        valuesToChange.userName = inputs.userName;
      } else {
        return exits.invalidParams({
          error: {
            code: 105,
            message: 'Username is too short/long or contains illegal characters'
          }
        });
      }
    }
    if(inputs.avatar) {
      // TODO Validate avatar
      valuesToChange.avatar = inputs.avatar;
    }

    if([0, 1].includes(inputs.role)) {
      if(!this.req.me['role'] === 0) {
        return exits.unauthorized();
      }
      valuesToChange.role = inputs.role;
    } else if(inputs.role) {
      return exits.invalidParams('Invalid user role');
    }


    try {
      var updatedUser = await Member.updateOne({ id: inputs.userId })
        .set(valuesToChange);
      if(!updatedUser) {
        return exits.nonExistent();
      }
    } catch(err) {
      if(err.code === 'E_UNIQUE') {
        return exits.nameTaken('Username already taken');
      }
    }
    return exits.success();
  }
};

