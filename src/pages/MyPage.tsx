import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useResetRecoilState } from "recoil";
import { memberInfoState } from "recoil/userState";
import RightArrowIcon from "components/icons/RightArrowIcon";
import Popup from "components/live/PopUp";
import MenuCloseIcon from "components/icons/MenuCloseIcon";
import PwdInput from "components/mypage/PwdInput";
import NicknameInput from "components/mypage/NicknameInput";
import AddressInput from "components/mypage/AddressInput";
import ResumeEdit from "components/mypage/ResumeEdit";
import DownArrowIcon from "components/icons/DownArrowIcon";
import ConfirmBtn from "components/buttons/CofirmBtn";
import { removeLocalStorage } from "libs/localStorage";
import { axiosInstance } from "apis/axiosConfig";
import { API } from "apis/apis";

const MyPage = () => {
  const { memberId } = useParams();
  const [memberInfo, setMemberInfo] = useRecoilState(memberInfoState);
  const resetMemberInfo = useResetRecoilState(memberInfoState);
  const navigate = useNavigate();

  const careerInfoMenu = ["이력", "후기"];
  const userInfoMunu = [
    { menu: "닉네임", url: "nickname" },
    { menu: "거주지", url: "address" },
  ];

  const [nickname, setNickname] = useState("");
  const [address, setAddress] = useState("");

  const [modalOpened, setModalOpened] = useState(false);
  const [pwdEditOpend, setPwdEditOpend] = useState(false);
  const [nicknameEditOpend, setNicknameEditOpend] = useState(false);
  const [adressEditOpend, setAdressEditOpend] = useState(false);
  const [mentorEditOpend, setMentorEditOpend] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const userData = await API.getUser(memberInfo.memberId!);
      setMemberInfo({
        ...memberInfo,
        memberInfo: userData.data?.data,
      });
    };
    getUser();
  }, [nickname, address]);

  const [activeIndex, setActiveIndex] = useState(0);
  const onMenuClick = (idx: number): any => {
    setActiveIndex(idx);
  };

  const editUserInfo = async (path: string, data: string) => {
    await axiosInstance
      .patch(
        `/api/member/${path}`,
        { memberId, [path]: data },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      )
      .then((res) => {
        alert("저장에 성공했습니다");
        setModalOpened(false);
        if (path === "nickname") {
          setNickname(data);
          setNicknameEditOpend(false);
        } else {
          setAddress(data);
          setAdressEditOpend(false);
        }
      })
      .catch((err) => {
        alert("저장에 실패했습니다");
        console.log(err);
      });
  };

  const handleUserInfoModal = (path: string) => {
    if (path === "nickname") setNicknameEditOpend(true);
    else if (path === "address") setAdressEditOpend(true);
    else if (path === "password") setPwdEditOpend(true);
    else if (path === "mentor") setMentorEditOpend(true);
    setModalOpened(true);
  };

  const handleUserDelete = () => {
    if (window.confirm("확인을 누르면 회원 정보가 삭제됩니다.")) {
      axiosInstance
        .delete(`/api/auth/${memberId}`)
        .then(() => {
          localStorage.clear();
          alert("그동안 이용해주셔서 감사합니다.");
          navigate("/");
        })
        .catch((err) => alert(err.res.data.message));
    } else {
      return;
    }
  };

  const handleLogout = () => {
    resetMemberInfo();
    removeLocalStorage("access_token");
    removeLocalStorage("refresh_token");
    navigate("/");
  };

  const handleMentorBtnClick = () => {
    axiosInstance
      .patch(
        `/api/member/mentor`,
        {},
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      )
      .then((res) => {
        alert("멘토로 등록됐습니다");
        console.log(res.data);
      })
      .catch((err) => {
        alert("멘토 등록에 실패했습니다");
        console.log(err);
      });
  };

  return (
    <div className="md:grid grid-cols-3 gap-2 h-auto">
      {/* 왼쪽 - 내정보 관리 */}
      <div className=" sm:bg-zinc-50 sm:rounded-3xl sm:mr-4 sm:shadow-lg md:sticky sm:top-20 sm:h-fit sm:p-4 border-b-2 mb-20 pb-14">
        <div className="flex pb-4 mb-4 border-b ">
          <div className="w-[150px] h-[100px] rounded-3xl bg-slate-200"></div>
          <div className="flex flex-col justify-between px-3 text-sm w-full">
            <div>
              <span className="text-accent-200 font-bold">{`<칭호/>`}</span>
              <span> {`${memberInfo.memberInfo.nickname}`}</span>
            </div>
            <div className="font-light">
              포인트
              <span className="font-bold">
                {` ${memberInfo.memberInfo.point} `}
              </span>
              점
            </div>
            <div className="flex justify-end">
              <button
                className="py-2 px-4 w-fit bg-slate-200 rounded-md text-accent-400 font-bold hover:bg-slate-300"
                onClick={() => handleUserInfoModal("mentor")}
              >
                멘토 등록하기
              </button>
            </div>
          </div>
        </div>
        <div className="pb-4 mb-4 md:border-b">
          <div className="font-extrabold text-zinc-500 mb-2 flex justify-between">
            내 정보 관리
            <button
              className="p-1.5 text-accent-100 rounded-md border border-accent-100 font-bold  hover:bg-slate-200 text-[10px]"
              onClick={() => handleUserInfoModal("password")}
            >
              비밀번호 변경
            </button>
          </div>
          <div className="transition-all rounded-md p-2 flex justify-between">
            이메일
            <span className=" text-slate-400">{`${memberInfo.memberInfo.email}`}</span>
          </div>
          {userInfoMunu?.map((el) => (
            <div
              className="hover:bg-zinc-200 transition-all rounded-md p-2 flex justify-between cursor-pointer"
              onClick={() => handleUserInfoModal(el.url)}
              key={el.menu}
            >
              {el.menu} <RightArrowIcon />
            </div>
          ))}
        </div>

        <div className="flex justify-around">
          <button
            className="py-2 px-4 text-xs bg-slate-200 rounded-md text-accent-400 font-bold hover:bg-slate-300"
            onClick={handleLogout}
          >
            로그아웃
          </button>
          <button
            className="py-2 px-4 text-xs bg-red-100 rounded-md text-red-500 font-bold hover:bg-opacity-70"
            onClick={handleUserDelete}
          >
            회원탈퇴
          </button>
        </div>
      </div>
      {/* 오른쪽 - 커리어 정보관리 */}
      <div className="sm:bg-zinc-50 sm:rounded-3xl sm:col-span-2 h-auto sm:shadow-lg sm:p-4">
        <div className="font-extrabold text-zinc-500 mb-2">
          커리어 정보 관리
        </div>
        {careerInfoMenu?.map((el, idx) => {
          const active = idx === activeIndex ? true : false;
          return (
            <div key={el}>
              <div
                className={`hover:bg-zinc-200 transition-all rounded-md p-2 flex justify-between font-bold text-xl ${
                  active ? "font-extrabold" : "text-gray-500"
                }
          }`}
                onClick={() => onMenuClick(idx)}
              >
                {el} <DownArrowIcon stroke="black" />
              </div>
              {el === "이력" ? <ResumeEdit active={active} /> : <></>}
            </div>
          );
        })}
      </div>

      {modalOpened ? (
        <Popup>
          <div className="w-[400px] h-fit relative">
            <div className="flex justify-end items-end">
              <div />
              <MenuCloseIcon
                className="cursor-pointer absolute top-0"
                fill="black"
                onClick={() => {
                  setModalOpened(false);
                  setNicknameEditOpend(false);
                  setAdressEditOpend(false);
                  setPwdEditOpend(false);
                  setMentorEditOpend(false);
                }}
              />
            </div>
            {mentorEditOpend && (
              <div className="h-[200px]">
                <div className="flex font-bold text-xl justify-center mt-2 mb-8">
                  멘토 등록
                </div>
                <div className="text-sm font-bold mt-5 border-b py-1 mb-2 text-slate-500">
                  나의 멘토 정보
                </div>
                <span className="text-slate-400 text-xs">
                  멘토 미등록 상태입니다. 멘토 역할을 맡고 싶다면 등록해주세요.
                </span>
                <div className="flex justify-end mt-10">
                  <ConfirmBtn type="submit" onClick={handleMentorBtnClick}>
                    저장
                  </ConfirmBtn>
                </div>
              </div>
            )}
            {pwdEditOpend && <PwdInput memberId={memberId} />}
            {nicknameEditOpend && (
              <NicknameInput
                memberId={memberId}
                editUserInfo={editUserInfo}
                prevNickname={memberInfo.memberInfo.nickname}
              />
            )}
            {adressEditOpend && (
              <AddressInput
                memberId={memberId}
                editUserInfo={editUserInfo}
                prevAddress={memberInfo.memberInfo.address}
              />
            )}
          </div>
        </Popup>
      ) : null}
    </div>
  );
};
export default MyPage;
