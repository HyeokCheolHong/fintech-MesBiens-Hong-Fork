import React, { useEffect, useState } from "react";
import { M, I } from "./style";
// import L from "../login/LoginStyle";
import DefaultInputField from "../../components/inputfield/InputField";
import DefaultButton from "../../components/button/DefaultButton";
import VerticalDivider from "../../components/divider/VerticalDivider";
import { useCookies } from "react-cookie";
import { RootState } from "../../modules/store/store";
import { useDispatch, useSelector } from "react-redux";
import ModalFunc from "../../components/modal/utils/ModalFunc";
import { ModalKeys } from "../../components/modal/keys/ModalKeys";
import Carousel from "./carousel/Carousel";
import { login } from "../../modules/user/userSlice"; // login 액션 가져오기

const IntroPageBeforeLogin: React.FC = () => {
  const { handleModal } = ModalFunc();
  const [loginForm, setLoginForm] = useState({
    userID: "",
    userPassword: "",
  });

  const [cookies, setCookie, removeCookie] = useCookies<string>([
    "userID",
    "rememberMe",
  ]);
  const [errors, setErrors] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (cookies.rememberMe) {
      setLoginForm((prevForm) => ({
        ...prevForm,
        userID: cookies.rememberMe,
      }));
      setRememberMe(true);
    }
  }, [cookies.rememberMe]);

  const HandleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const { userID, userPassword } = loginForm;

    if (userID === "" || userPassword === "") {
      setErrors("ID 또는 비밀번호를 입력해 주세요!");
      return;
    }

    try {
      const response = await fetch("http://localhost:7200/members/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키 포함 요청 설정
        body: JSON.stringify({
          memberId: userID,
          password: userPassword,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      dispatch(
        login({
          name: result.name,
          username: result.username,
          email: result.email,
        })
      );

      handleModal(ModalKeys.LOGIN_SUCCESS);
      console.log("로그인 성공:", result);

      setCookie("userID", userID, { maxAge: 30 * 24 * 60 * 60 });

      if (rememberMe) {
        setCookie("rememberMe", userID, { maxAge: 30 * 24 * 60 * 60 });
      } else {
        removeCookie("rememberMe");
      }
    } catch (error: any) {
      setErrors(error.message);
    }
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  return (
    <M.MainContainer>
      <M.LeftAreaContainer>
        <Carousel />
      </M.LeftAreaContainer>
      <div style={{ alignContent: "center" }}>
        <VerticalDivider height="90%" />
      </div>
      <M.LoginContainer>
        <I.Container_top>
          <h1
            style={{
              fontSize: "3em",
              margin: "0 0 40px 0",
              padding: "20px",
            }}
          >
            Login
          </h1>
        </I.Container_top>
        <I.Container_bottom>
          <I.P_tag>회원 ID와 비밀번호를 입력하세요.</I.P_tag>
          <form onSubmit={HandleLogin}>
            <DefaultInputField
              id="username"
              placeholder="회원 ID"
              // required
              value={loginForm.userID}
              onChange={(e) =>
                setLoginForm({ ...loginForm, userID: e.target.value })
              }
            />
            <br />
            <DefaultInputField
              type="password"
              id="password"
              placeholder="비밀번호"
              // required
              value={loginForm.userPassword}
              onChange={(e) =>
                setLoginForm({ ...loginForm, userPassword: e.target.value })
              }
            />
            <I.RememberMe
              type="checkbox"
              checked={rememberMe}
              onChange={handleCheckbox}
            />
            <label htmlFor="remember">ID 기억하기</label>
            {errors && <div style={{ color: "red" }}>{errors}</div>}
            <DefaultButton width="100%">Login</DefaultButton>
          </form>
          <I.SignUp>
            <a href="/signup">회원가입</a>
            <a href="findID">아이디/비밀번호 찾기</a>
          </I.SignUp>
        </I.Container_bottom>
      </M.LoginContainer>
    </M.MainContainer>
  );
};
export default IntroPageBeforeLogin;
