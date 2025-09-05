const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
});

userSchema.plugin(passportLocalMongoose, {
  errorMessages: {
    UserExistsError: "そのユーザー名は既に使われています",
    MissingPasswordError: "パスワードを入力してください",
    AttemptTooSoonError:
      "アカウントがロックされています、時間を空けて試してください",
    TooManyAttemptsError:
      "ログインの失敗が続いたため、アカウントをロックしました",
    NoSaltValueStoredError: "認証ができませんでした",
    IncorrectPasswordError: "パスワードまたはユーザー名が間違っています",
    IncorrectUsernameError: "パスワードまたはユーザー名が間違っています",
    MissingUsernameError: "ユーザー名を入力してください",
  },
});

module.exports = mongoose.model("User", userSchema);
