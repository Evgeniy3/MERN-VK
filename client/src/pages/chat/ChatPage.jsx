import React, { useEffect } from "react";
import style from "./Chat.module.scss";
import Channel from "../../components/channel/Channel";
import Message from "../../components/message/Message";
import { useDispatch, useSelector } from "react-redux";
import { userData } from "../../store/authSlice";
import { socket } from "../../server";
import { fetchDirectConversations } from "../../store/messageSlice";

const ChatPage = () => {
  const data = useSelector(userData);
  const userId = data?._id
  const { chatType, roomId, conversations } = useSelector(
    (state) => state.messages
  );
  const dispatch = useDispatch();

  useEffect(() => {
    socket?.emit("get_direct_conversations", { userId: userId }, (data) => {
      dispatch(
        fetchDirectConversations({ conversations: data, userId: userId })
      );
    });
    document.title = 'Мессенджер';
  }, []);

  return (
    <div className={style.chat}>
      <div className={style.chat__channels}>
        <h3 className={style.chat__title}>Чат:</h3>
        {conversations.length !== 0 ? (
          conversations.map((conversation) => (
            <Channel key={conversation._id} conversation={conversation} />
          ))
        ) : (
          <div className={style.chat__channelEmpty}>Список чата пуст.</div>
        )}
      </div>
      <div className={style.chat__messages}>
        {roomId !== null && chatType === "individal" ? (
          <Message />
        ) : (
          <div className={style.chat__mesEmpty}>
            <svg
              version="1.1"
              id="Layer_1"
              viewBox="0 0 512 512"
              width="150px"
              height="150px"
            >
              <g>
                <g>
                  <path
                    d="M484.799,112.939L248.55,349.188c-1.968,1.968-4.436,3.358-7.138,4.021l-94.118,23.113 c-1.202,0.295-2.422,0.439-3.632,0.439c-3.99,0-7.878-1.57-10.769-4.461c-3.767-3.767-5.292-9.228-4.021-14.401l23.113-94.118 c0.663-2.701,2.053-5.17,4.021-7.138L378.699,33.952H87.989c-44.765,0-81.183,36.419-81.183,81.183v315.684 C6.806,475.582,43.224,512,87.989,512h315.684c44.763,0,81.182-36.419,81.182-81.182V115.135 C484.855,114.398,484.819,113.671,484.799,112.939z"
                    fill="#000000"
                    style={{ fill: "rgb(135, 135, 135)" }}
                  ></path>
                </g>
              </g>
              <g>
                <g>
                  <path
                    d="M500.203,30.314L474.879,4.992c-6.656-6.656-17.486-6.656-24.141,0L201.344,254.385c1.034,0.624,2.019,1.367,2.912,2.26 l46.742,46.742c0.047,0.047,0.086,0.098,0.132,0.145L500.203,54.459C506.858,47.803,506.858,36.971,500.203,30.314z"
                    fill="#000000"
                    style={{ fill: "rgb(135, 135, 135)" }}
                  ></path>
                </g>
              </g>
              <g>
                <g>
                  <path
                    d="M182.716,278.183c-0.868-0.868-1.594-1.821-2.208-2.823l-16.057,65.384l64.89-15.936L182.716,278.183z"
                    fill="#000000"
                    style={{ fill: "rgb(135, 135, 135)" }}
                  ></path>
                </g>
              </g>
            </svg>
            <p>
              Начни диолог из списка чата,<br></br> или начни новый диолог.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
