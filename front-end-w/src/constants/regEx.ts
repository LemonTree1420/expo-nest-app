export const basicRegEx = {
  ENG: /^[a-zA-Z]*$/, // 영어만
  NUM: /^[0-9]*$/, // 숫자만
  ENGNUM: /^[a-zA-Z0-9]*$/, //영어+숫자
  SP_CHAR: /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, // 특수문자 비허용
  ONLY_NUM: /[^0-9]/g,
};

export const formRegEx = {
  EMAIL:
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,6}$/, //이메일
  EMAIL_ADDRESS: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*$/, // 이메일 주소 부분만
  EMAIL_DOMAIN: /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,6}$/, // 이메일 도메인 부분만
  PASSWORD:
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/, //비밀번호(영어+숫자+특수문자 반드시 포함 & 8~16)
  HP_NUM: /^01[016789]{1}-?(\d{3,4})-?(\d{4})$/, // 휴대폰번호(-포함가능)
  PH_NUM: /^\d{2,3}-?\d{3,4}-?\d{4}$/, // 전화번호(-제외)
};

export const moneyComma = (str: string) => {
  return str.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ",");
};
