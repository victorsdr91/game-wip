import { FC, useState } from "react";
import useTypewriter from "ui/clientState/hooks/useGameEvent/useTypewriter";
import { SanitizeHTML } from "../Common/SanitizeHtml";

export interface DialogueProps {
    conversation: {actor: string, texts: string[]}[];
    onFinishConversation: () => void;
}

const Dialogue: FC<DialogueProps> = ({conversation, onFinishConversation}) => {

    const [currentActor, setCurrentActor] = useState<number>(0);
    const [conversationIdx, setConversationIdx] = useState<number>(0);
    const [displayText, setDisplayText] = useState<string>(conversation[0]?.texts[0] || '');
    const [show, setShow] = useState<boolean>(true);

    const nextText = () => {
        setConversationIdx(conversationIdx + 1);
        const currentConversation = conversation[currentActor].texts;
        if (!currentConversation || !currentConversation[conversationIdx+1]) {
            const nextActor = currentActor+1;
            if (conversation[nextActor]) {
                setCurrentActor(nextActor);
                setConversationIdx(0);
                const nextText = conversation[nextActor].texts[0];
                if(nextText) {
                    setDisplayText(nextText);
                }
            } else {
                onFinishConversation();
                setShow(false);
            }
            return;
        }
        setDisplayText(conversation[currentActor].texts[conversationIdx+1]);
    };

    const { actor } = conversation[currentActor]; 

    return (<div className={`${show ? '' : 'hidden'} font-[PublicPixel] excalibur-scale absolute inset-x-0 mr-auto ml-0 bg-gray-800 text-gray-200 bottom-[9%] w-[800px] min-h-4 max-h-[180px] p-2 rounded-md border-gray-50 border-2`} onClick={nextText}>
                <div className="bg-gray-900 text-yellow-200 border-gray-50 border-2 w-1/4 p-2 relative top-[-30px] left-[10px] rounded-md text-center">
                    {actor}
                </div>
                <div className="ml-4 text-xs">
                    <SanitizeHTML html={useTypewriter(displayText, 100)}/>
                </div>
                <div className="text-3xl text-right blink" >&#9755;</div>
            </div>);
};

export default Dialogue; 