import React, { useState } from "react";
import L from "../login/LoginStyle";
import DefaultInputField from "../../components/inputfield/InputField";
import DefaultButton from "../../components/button/DefaultButton";
import VerticalDivider from "../../components/divider/VerticalDivider";
import { useDispatch } from "react-redux";
import { signup } from "../../modules/user/userSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../modules/store/store";
import ModalFunc from "../../components/modal/utils/ModalFunc";
import { ModalKeys } from "../../components/modal/keys/ModalKeys";
import ModalRendererComponent from "../../components/modal/ModalRendererComponent";

const SignupPage: React.FC = () => {
  const { handleModal } = ModalFunc();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string>("");

  // 정규표현식 검사
  const hasLowercase = /[a-z]/;
  const hasUppercase = new RegExp("[A-Z]");
  const hasSpecialChar = /[!$&-]+/;
  const hasDigit = new RegExp("[0-9]");
  const isValidPassword = (pwd: string): boolean => {
    let matchCount = 0;

    if (hasLowercase.test(pwd)) matchCount++;
    if (hasUppercase.test(pwd)) matchCount++;
    if (hasSpecialChar.test(pwd)) matchCount++;
    if (hasDigit.test(pwd)) matchCount++;

    return matchCount >= 2;
  };

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 비밀번호와 비밀번호 확인 일치 여부 검사
    if (password === "") {
      setErrors(
        "대문자/소문자/숫자/특수문자를 조합하여 10~16자로 입력해주세요."
      );
      return;
    } else if (!isValidPassword(password)) {
      setErrors(
        "대문자/소문자/숫자/특수 문자 중 2가지 이상 조합하셔야 합니다."
      );
      return;
    } else if (password !== confirmPassword) {
      setErrors("비밀번호가 일치하지 않습니다!");
      return;
    } else {
      setErrors(""); // 오류 메시지 초기화

      // 서버로 회원가입 요청 보내기
      try {
        const response = await fetch("http://localhost:7200/members/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            username,
            password, // 서버로 패스워드 전송
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "회원가입 실패");
        }

        // 회원가입 성공 시, 패스워드는 제외하고 Redux에 사용자 정보 저장
        dispatch(
          signup({
            name,
            email,
            username,
            // 패스워드 제외
          })
        );

        // 성공적인 회원가입 후 처리
        handleModal(ModalKeys.SIGNUP_SUCCESS);
        console.log("Signup Data:", { name, email, username });
        console.log("Redux State:", user);

        // 추가적인 페이지 리디렉션 혹은 알림 처리
        // navigate("/login");
      } catch (error: any) {
        setErrors(error.message); // 에러 발생 시 처리
      }
    }
  };
  return (
    <L.Body>
      <L.MainContainer>
        <L.Container_top>
          <h1 style={{ fontSize: "3em" }}>회원가입</h1>
        </L.Container_top>
        <L.Container_bottom>
          <L.P_tag>회원정보를 모두 입력하세요.</L.P_tag>
          <form onSubmit={handleSubmit}>
            <DefaultInputField
              type="text"
              id="name"
              placeholder="회원 이름 (홍길동)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <DefaultInputField
              type="email"
              id="email"
              placeholder="회원 이메일 (fintech@gmail.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <DefaultInputField
              type="text"
              id="username"
              placeholder="회원 ID (fintech123)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <DefaultInputField
              type="password"
              id="password"
              placeholder="비밀번호 (123456)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <DefaultInputField
              type="password"
              id="confirm-password"
              placeholder="비밀번호 확인 (123456)"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {errors && <div style={{ color: "red" }}>{errors}</div>}
            <DefaultButton width="100%">Sign Up</DefaultButton>
          </form>
          <L.Divider>
            <span>또는</span>
          </L.Divider>
          <L.SNSLogin>
            <L.SNSButton id={"NaverLogin"} />
            <L.SNSButton id={"KakaoLogin"} />
            <L.SNSButton id={"GoogleLogin"} />
          </L.SNSLogin>
        </L.Container_bottom>
        <L.SignUp>
          <L.P_tag>
            <a href="/login">로그인 </a>
          </L.P_tag>
          <VerticalDivider height={"20px"} style={{ marginLeft: "20px" }} />
          <L.P_tag style={{ margin: "20px" }}>
            <a href="/">홈으로</a> 나가기
          </L.P_tag>
        </L.SignUp>
      </L.MainContainer>
      <ModalRendererComponent />
    </L.Body>
  );
};

export default SignupPage;
