export default {
  email: {
    error: 'Email Failed to Send',
    success: 'Email sent',
  },
  notification: {
    newMatchRequest: {
      title: 'New match request',
      body: 'Would you like to match you see',
    },
    newMessage: {
      body: 'Shared a 📷 with you ',
    },
    matchAcceptance: {
      title: 'You Have a New Match!',
      body: '{{fullName}} has accepted your match. Start chatting now!',
    },
  },
  validation: {
    user: {
      auth: {
        getAccessTokenValidation: {
          min: 'Your name must have at least 3 characters',
          max: 'Name must have a maximum of 30 characters',
          empty: 'It is mandatory to fill',
          required: 'It is mandatory to fill',
        },
        register: {
          userName: {
            min: 'Username must be at least 3 characters',
            max: 'Username must be a maximum of 15 characters',
            regex:
              'Only letters, numbers, underscores and periods can be used!',
            empty: 'Username is required',
          },
          info: {
            biographyMax: 'Your bio must have a maximum of 200 characters',
            birthdayFormat: 'Your birthday must be in the format MM-DD-YYYY',
            gender: 'Gender must be Male, Female, or I do not want to specify',
          },
          password: {
            min: 'Password must be at least 8 characters',
            max: 'Password must be no more than 100 characters',
            notMatch: 'Passwords do not match',
            required: 'Password is required',
            requiredAgainPassword: 'Password repetition is required',
          },
          email: {
            regex: 'Email is invalid',
            empty: 'Email is required',
          },
        },
        login: {
          email: {
            regex: 'Email is invalid',
            empty: 'Email is required',
          },
          otpCode: {
            empty: 'OTP code is required',
            max: 'OTP code must be a maximum of 4 characters',
            min: 'OTP code must be at least 4 characters',
          },
        },
        sendOTPCode: {
          email: {
            regex: 'Email is invalid',
            empty: 'Email is required',
          },
        },
      },
      user: {
        genre: {
          min: 'En az 5 tür seçmelisiniz',
          max: 'En fazla 27 tür seçebilirsiniz',
        },
        favorites: {
          empty: 'Favoriler boş geçilemez',
        },
        notification: 'Lütfen doğru formatta gönderdiğinizden emin olun',
        discoverySettings: {
          min: 'Minimum yaş sınırı 18 olmalıdır',
          max: 'Maximum yaş sınırı 102 olmalıdır',
          genderPreference:
            "Cinsiyet tercihiniz Erkek, Kadın veya Hepsin'den biri olmalıdır",
          matchType:
            "Eşleşme tercihiniz Film, Dizi veya Hepsin'den biri olmalıdır",
        },
      },
    },
  },
  controllers: {
    user: {
      auth: {
        incorrectUsernameOrPassword:
          'Username or password is incorrect, please check',
        invalidToken: 'Please provide a valid token.',
        invalidTokenExpired: 'Invalid token or session has expired.',
        userNotFound: 'User not found',
        resetPassword: 'Your password has been reset successfully.',
        checkEmail: 'Please check your email',
        invalidOTPExpired: 'Invalid OTP or session has expired.',
      },
      user: {
        updatePassword: 'Your password has been changed.',
        duplicateGenre: 'You cannot register the same genre again',
        uploadPhoto: 'Your photo successfully has uploaded',
      },

      discover: {
        duplicateDiscovery: 'Such a match already exists',
        reachedMatch: "You've reached your daily match limit",
        matchedCheck: 'You cannot retrieve a matched user',
        noMatch: 'No match found',
      },
    },
  },
  movie: {
    status: {
      Rumored: 'Rumored',
      Planned: 'Planned',
      'In Production': 'In Production',
      'Post Production': 'Post Production',
      Released: 'Released',
      Canceled: 'Canceled',
    },
  },
  errors: {
    underage: 'You must be 18 years old to register',
    overage: 'You must be 100 years old to register',
    duplicateEmail: 'This email has already been received',
    duplicateUserName: 'This username is already taken',
    notFoundUser: 'User not found',
    multiTypeError: 'Please provide a valid image file',
    conversationNotFound: 'Chat not found',

    '400': {
      title: 'Bad request',
      type: 'BAD_REQUEST_ERROR',
      message: 'Your request is invalid.',
    },
    '429': {
      title: 'Too many requests',
      type: 'TOO_MANY_REQUESTS_ERROR',
      message: 'Your request is too many, please wait',
    },
    '401': {
      title: 'Unauthorized',
      type: 'UNAUTHORIZED_ERROR',
      message: 'You are not authorized to perform this action.',
    },
    '403': {
      title: 'Forbidden',
      type: 'FORBIDDEN_ERROR',
      message: 'You are not authorized to perform this action.',
    },
    '404': {
      title: 'Not found',
      type: 'NOT_FOUND_ERROR',
      message: 'The resource you are looking for could not be found.',
    },
    '409': {
      title: 'Conflict',
      type: 'CONFLICT_ERROR',
      message: 'The resource you are looking for already exists.',
    },

    '422': {
      title: 'Unprocessable entity',
      type: 'UNPROCESSABLE_ENTITY_ERROR',
      message: 'Your request is invalid.',
    },
    410: {
      title: 'Gone',
      type: 'GONE_ERROR',
      message: 'This request has expired.',
    },
    '500': {
      title: 'Internal server error',
      type: 'CONFLICT_ERROR',
      message: 'Something went wrong, please try again.',
    },
  },

  gender: {
    1: 'Women',
    2: 'Man',
  },
};
