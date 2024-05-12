export default {
  email: {
    error: 'E-posta Gönderilemedi',
    success: 'E-posta gönderildi',
  },
  notification: {
    newMatchRequest: {
      title: 'Yeni Eşleşme İsteğin Var',
      body: 'Kim olduğunu görmek ister misin?',
    },
    newMessage: {
      body: 'Bir 📷 paylaştı',
    },
    matchAcceptance: {
      title: 'Yeni Bir Eşleşmen Var!',
      body: '{{fullName}} eşleşmeni kabul etti. Şimdi sohbete başlayın!',
    },
  },
  validation: {
    user: {
      auth: {
        getAccessTokenValidation: {
          min: 'İsminizde en az 3 karakter bulunmalıdır',
          max: 'İsminde en fazla 30 karakter bulunmalıdır',
          empty: 'Doldurulması zorunludur',
          required: 'Doldurulması zorunludur',
        },
        register: {
          userName: {
            min: 'Kullanıcı adı en az 3 karakterli olmalıdır',
            max: 'Kullanıcı adı en fazla 15 karakterli olmalıdır',
            regex: 'Sadece harf, rakam, alt çizgi veya nokta kullanılabilir!',
            empty: 'Kullanıcı adı zorunludur',
          },
          info: {
            biographyMax: 'Biyografin en fazla 200 karakter bulunmalıdır',
            birthdayFormat: 'Doğum günün GG-AA-YYYY formatında olmalıdır',
            gender:
              'Cinsiyetin Erkek, Kadın veya Belirtmek istemiyorumdan biri olmalıdır',
          },
          email: {
            regex: 'E-posta geçersiz',
            empty: 'E-mail zorunludur',
          },
          password: {
            min: 'Şifre en az 8 karakterli olmalıdır',
            max: 'Şifre en fazla 100 karakterli olmalıdır',
            notMatch: 'Şifreler eşleşmiyor',
            required: 'Şifre zorunludur',
            requiredAgainPassword: 'Şifre tekrarı zorunludur',
          },
        },
        login: {
          email: {
            regex: 'E-posta geçersiz',
            empty: 'E-mail zorunludur',
          },
          otpCode: {
            empty: 'OTP kodu zorunludur',
            max: 'OTP kodu en fazla 4 karakterli olmalıdır',
            min: 'OTP kodu en az 4 karakterli olmalıdır',
          },
        },
        sendOTPCode: {
          email: {
            regex: 'E-posta geçersiz',
            empty: 'E-mail zorunludur',
          },
        },
      },
      user: {
        notification: 'Please make sure you send in the correct format',
        discoverySettings: {
          min: 'Minimum age must be 18',
          max: 'Maximum age must be 102',
          genderPreference:
            'Your gender preference must be Male, Female or All',
          matchType: 'Your match preference must be Movie, Series or All',
        },
        genre: {
          min: 'You must choose at least 5 species',
          max: 'You can select up to 27 types',
        },
        favorites: {
          empty: 'Favorites cannot be empty',
        },
      },
    },
  },
  controllers: {
    user: {
      auth: {
        incorrectUsernameOrPassword:
          'Kullanıcı adı veya şifre yanlış, lütfen kontrol edin',
        invalidToken: 'Lütfen geçerli bir token sağlayın.',
        invalidTokenExpired: 'Geçersiz token veya oturum süresi doldu.',
        userNotFound: 'Kullanıcı bulunamadı',
        resetPassword: 'Şifreniz başarıyla sıfırlandı.',
        checkEmail: 'Lütfen e-postanızı kontrol edin',
        invalidOTPExpired: 'Geçersiz kod veya süresi doldu.',
      },
      user: {
        updatePassword: 'Şifreniz değiştirildi.',
        duplicateGenre: "Aynı tür'e bir daha kayıt olamazsın",
        uploadPhoto: 'Fotoğrafınız başarıyla yüklendi',
      },
      discovery: {
        duplicateDiscovery: 'Böyle bir eşleşme zaten mevcut',
        reachedMatch: 'Günlük eşleşme limitini doldurdun',
        matchedCheck: 'Eşleştiğin bir kullanıcıyı geri alamazsınız',
        noMatch: 'Eşleşme bulunamadı',
      },
    },
  },
  movie: {
    status: {
      Rumored: 'Söylenti',
      Planned: 'Planlanmış',
      'In Production': 'Yapim Aşamasında',
      'Post Production': 'Post Prodüksiyon',
      Released: 'Yayınlandı',
      Canceled: 'Iptal Edildi',
      Ended: 'Bitti',
    },
  },
  errors: {
    duplicateEmail: 'Bu e-posta daha önceden alınmış',
    duplicateUserName: 'Bu kullanıcı adı daha önceden alınmış',
    underage: 'Kayıt olmak için 18 yaşında olmanız gerekmektedir',
    overage: 'Kayıt olmak için 100 yaşından küçük olmanız gerekmektedir',
    notFoundUser: 'Kullanıcı bulunamadı',
    multerTypeError: 'Lütfen geçerli bir resim dosyası sağlayın',
    conversationNotFound: 'Sohbet bulunamadı',

    '400': {
      title: 'Bad request',
      type: 'BAD_REQUEST_ERROR',
      message: 'Yaptığınız istek geçersiz.',
    },
    '429': {
      title: 'Too many requests',
      type: 'TOO_MANY_REQUESTS_ERROR',
      message: 'Yaptığınız istek çok fazla, lütfen bekleyin',
    },
    '401': {
      title: 'Unauthorized',
      type: 'UNAUTHORIZED_ERROR',
      message: 'Bu eylemi gerçekleştirme yetkiniz yok.',
    },
    '403': {
      title: 'Forbidden',
      type: 'FORBIDDEN_ERROR',
      message: 'Bu eylemi gerçekleştirme yetkiniz yok.',
    },
    '404': {
      title: 'Not found',
      type: 'NOT_FOUND_ERROR',
      message: 'Aradığınız kaynak bulunamadı.',
    },
    '409': {
      title: 'Conflict',
      type: 'CONFLICT_ERROR',
      message: 'Aradığınız kaynak zaten mevcut.',
    },

    '422': {
      title: 'Unprocessable entity',
      type: 'UNPROCESSABLE_ENTITY_ERROR',
      message: 'Yaptığınız istek geçersiz.',
    },
    '410': {
      title: 'Gone',
      type: 'GONE_ERROR',
      message: 'Bu isteğin süresi dolmuş.',
    },
    '500': {
      title: 'Internal server error',
      type: 'CONFLICT_ERROR',
      message: 'Bir şeyler yanlış gitti, lütfen tekrar deneyiniz.',
    },
  },
  gender: {
    1: 'Kadın',
    2: 'Erkek',
  },
};
