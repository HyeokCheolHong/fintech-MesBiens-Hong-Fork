package mesbiens.transaction.service;

import java.time.LocalDateTime;
import java.util.List;

import mesbiens.transaction.dto.RecentTransactionResponseDTO;
import mesbiens.transaction.vo.TransactionDetailVO;

public interface TransactionDetailService {

	// 모든 거래내역 반환
	List<TransactionDetailVO> allList();

	// 인증 토큰에 저장된 현재 로그인 사용자의 memberNo를 기준으로 거래내역 반환
	List<RecentTransactionResponseDTO> getTrnsList(LocalDateTime startDate, LocalDateTime endDate);
	
	// 전송 계좌 패스워드 일치하는지 확인
	boolean pwdMatch(int senderAccountNo, String receiveAccountPassword);
	
	// 금액 전송 가능 여부 확인
	boolean isRemittance(int senderAccountNo, Long trnsBalance);
	
	// 송금하기
	boolean remittance(int receiveAccountNo, int senderAccountNo, Long trnsBalance);

	
	
	
//	List<TransactionDetailVO> getAllTransactionList();
//
//	List<TransactionDetailVO> getTransactionDate(Timestamp startDate, Timestamp endDate);
//
//
//	void withdrawal(TransactionDetailVO transactionDetailVO);
//
//	void payment(TransactionDetailVO transactionDetailVO);
//
//	void deleteTransaction(int id);
//
//	void createLog(String logMessage);
//
//	void deposit(TransactionDetailVO transactionDetailVO);
}
