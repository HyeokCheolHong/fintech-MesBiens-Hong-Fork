package mesbiens.common.util;
// Security 사용을 위한 React 연결 CORS 설정

public class SecurityConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("http://localhost:4000/*") // 허용할 출처 : React 도메인 
                .allowedMethods("GET", "POST", "DELETE", "UPDATE") // 허용할 HTTP method
                .allowCredentials(true); // 쿠키 인증 요청 허용

    }
}
