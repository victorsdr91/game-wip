import React, { FC, useState, KeyboardEvent, useEffect } from "react";
import useTypewriter from "ui/clientState/hooks/useGameEvent/useTypewriter";
import { SanitizeHTML } from "../Common/SanitizeHtml";
import { useGameEvent } from "ui/clientState/hooks/useGameEvent/useGameEvent";
import { GameEventType } from "state/helpers/Events";
import { DialogueTexts } from "model/Event/contract";
import { Game } from "services/Game";
import keyboard from "../../../../public/config/keyboard.json";

const Dialogue: FC<{isPlayerInteracting: boolean}> = ({ isPlayerInteracting }) => {

    const [conversation, setConversation] = useState<DialogueTexts>();
    const [currentActor, setCurrentActor] = useState<number>(0);
    const [conversationIdx, setConversationIdx] = useState<number>(0);
    const [displayText, setDisplayText] = useState<string>('');
    const [show, setShow] = useState<boolean>(false);
    const interactionKey = keyboard.shortcuts.interact.replace("Key", '');

    useGameEvent({ event: GameEventType.EVENT_DIALOGUE_START,
        callback: ({texts}:{texts: DialogueTexts}) => {
            setConversation(texts);
            setDisplayText(texts[currentActor].texts[conversationIdx]);
            setShow(true);
        }
    });

    const nextText = () => {
        setConversationIdx(conversationIdx + 1);
        if(conversation) {
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
                    setCurrentActor(0);
                    setConversationIdx(0);
                    setShow(false);
                    Game.getInstance().emit(GameEventType.EVENT_DIALOGUE_FINISH, {
                        finished: true
                    });
                }
                return;
            }
            setDisplayText(conversation[currentActor].texts[conversationIdx+1]);
        }
    };
    
    useEffect(() => {
        if(isPlayerInteracting && show) {
            nextText();
        }
    }, [isPlayerInteracting]);    

    const { actor } = conversation?.[currentActor] || { actor: ''};

    return (<div className={`${show ? '' : 'hidden'} absolute w-[600px]`} style={{bottom: 'calc(300px * var(--pixel-conversion))'}}>
                <div className={`inset-x-0 mr-auto ml-10 bg-gray-800 text-gray-200 w-full min-h-[100px] max-h-[200px] p-2 rounded-md border-gray-50 border-2`} onClick={nextText}>
                    <div className="bg-gray-900 text-yellow-200 border-gray-50 border-2 w-1/4 p-2 relative top-[-30px] left-[10px] rounded-md text-center">
                        {actor}
                    </div>
                    <div className="ml-4 text-xs">
                        <SanitizeHTML html={useTypewriter(displayText, 100)}/>
                    </div>
                    <div className="text-right blink">
                        <span className="text-l">[{interactionKey}]</span>
                    </div>
                   
                </div>
            </div>);
};

export default Dialogue; 