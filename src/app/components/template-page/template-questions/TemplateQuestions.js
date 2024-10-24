//React/Next imports
import { useState, useEffect } from "react";

//Chakra imports
import {
    Skeleton
} from "@chakra-ui/react";

//Components imports
import EditableQuestions from "./EditableQuestions";

//Services imports
import { getQuestionsTemplate } from "@/app/services/questionService";

//Context imports
import { useUI } from "../../../context/UIContext";

const TemplateQuestions = ({ id, checkAuth, isSavingChanges, setIsSavingChanges }) => {
    const { openSimpleErrorModal, setPageLoaded } = useUI();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [renderIdCount, setRenderIdCount] = useState(0);

    const getQuestions = async () => {
        const response = await getQuestionsTemplate(id);
        if (response.ok) {
            let renderIdCount = 0;
            setQuestions(response.data.map((question) => { return {...question, renderId: renderIdCount++ }} ));
            setRenderIdCount(renderIdCount);
        } else {
            setPageLoaded(false);
            openSimpleErrorModal(
                response.message,
                () => router.push('/dashboard')
            );
        }
    }

    const getRenderId = () => {
        setRenderIdCount(renderIdCount + 1);
        return renderIdCount;
    }

    const initializeComponent = async () => {
        await getQuestions();
        setLoading(false);
        setIsSavingChanges(false);
    }

    useEffect(() => {
        initializeComponent();
    }, []);

    return (
        <>
            {loading ? <Skeleton height="700px" />
                : <EditableQuestions
                    loadedQuestions={questions}
                    checkAuth={checkAuth}
                    getRenderId={getRenderId}
                    id={id}
                    setLoading={setLoading}
                    refreshInfo={initializeComponent}
                    isSavingChanges={isSavingChanges}
                    setIsSavingChanges={setIsSavingChanges} />}
        </>
    )
}

export default TemplateQuestions;