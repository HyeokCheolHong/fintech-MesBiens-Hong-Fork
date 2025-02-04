package mesbiens.member.dto;

import lombok.Data;

@Data
public class MemberResponseDTO {
    private int memberNo;          // 회원 번호
    private String memberName;     // 회원 이름
    private String memberEmail;    // 이메일
    private String memberId;       // 로그인 ID
    private String memberPhone;    // 전화번호
    private String memberAddress;  // 주소
    private String memberBirth;    // 생년월일
    private String memberProfile;  // 프로필 이미지
    private String memberSnsSignUpYN; // SNS 가입 여부 ('Y' 또는 'N')
    
    // 필요한 생성자 추가
    public MemberResponseDTO(String memberId, String memberName, String memberEmail) {
        this.memberId = memberId;
        this.memberName = memberName;
        this.memberEmail = memberEmail;
    }

    //  기본 생성자 추가 (Spring 사용 시 필수)
    public MemberResponseDTO() {}
}