import bcrypt from "bcrypt";
import pick from "lodash/pick";
import jwt from "jsonwebtoken";

const createTokens = (user, secret1, refreshSecret) => {
  const createToken = jwt.sign(
    {
      user: pick(user, ["id", "username"])
    },
    secret1,
    {
      expiresIn: "1m"
    }
  );

  const createRefreshToken = jwt.sign(
    {
      user: pick(user, "id")
    },
    refreshSecret,
    {
      expiresIn: "1d"
    }
  );

  return [createToken, createRefreshToken];
};

export const refreshTokens = async (refreshToken, models, secret1, secret2) => {
  let userId = 0;

  try {
    const {
      user: { id }
    } = jwt.decode(refreshToken);
    userId = id;
  } catch (err) {
    return {};
  }

  if (!userId) return {};

  const user = await models.User.findOne({ where: { id: userId }, raw: true });

  if (!user) return {};

  const refreshSecret = user.password + secret2;

  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = createTokens(
    user,
    secret1,
    refreshSecret
  );
  return {
    user,
    token: newToken,
    refreshToken: newRefreshToken
  };
};

export const tryLogin = async (email, password, models, secret1, secret2) => {
  const user = await models.User.findOne({ where: { email }, raw: true });
  const valid = await bcrypt.compare(password, user ? user.password : "");
  if (!user || !valid) {
    return {
      ok: false,
      errors: [
        {
          path: "email_password",
          message: "invalid login credentials"
        }
      ]
    };
  }

  const refreshSecret = user.password + secret2;

  const [token, refreshToken] = await createTokens(
    user,
    secret1,
    refreshSecret
  );

  return {
    ok: true,
    token,
    refreshToken
  };
};
