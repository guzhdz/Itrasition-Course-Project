//React/Next imports
import { useState, useEffect } from "react";

//Chakra imports
import {
    Skeleton
} from "@chakra-ui/react";

//Components imports
import SettingsForm from "./SettingsForm";

//Services imports
import { getTopics } from "../../services/topicService";
import { getTags } from "../../services/tagService";
import { getTemplate } from "../../services/templateService";

//Context imports
import { useUI } from "../../context/UIContext";

const TemplateSettings = ({id, checkAuth}) => {
    const { openSimpleErrorModal, setPageLoaded } = useUI();
    const [topicOptions, setTopicOptions] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [templateInfo, setTemplateInfo] = useState(null);

    const getTemplateInfo = async () => {
        const response = await getTemplate(id, "getTemplateSettings");
        if (response.ok) {
            console.log(response.data);
            setTemplateInfo(response.data);
        } else {
            setPageLoaded(false);
            openSimpleErrorModal(
                response.message,
                () => router.push('/dashboard')
            );
        }
    }

    const getTopicOptions = async () => {
        const response = await getTopics("getTopics");
        if (response.ok) {
            setTopicOptions(response.data);
        } else {
            setPageLoaded(false);
            openSimpleErrorModal(
                response.message,
                () => router.push('/dashboard')
            );
        }
    }

    const getTagOptions = async () => {
        const response = await getTags("getTags");
        if (response.ok) {
            const tags = response.data.map((topic) => {
                return {
                    value: topic.id,
                    label: topic.name
                }
            });
            setTagOptions(tags);
        } else {
            setPageLoaded(false);
            openSimpleErrorModal(
                response.message,
                () => router.push('/dashboard')
            );
        }
    }

    const initializeComponent = async () => {
        await getTemplateInfo();
        await getTopicOptions();
        await getTagOptions();
        setLoading(false); setLoading(false);
    }

    useEffect(() => {
        initializeComponent();
    }, []);

    return (
        <>
            {loading ? <Skeleton height="700px" />
                : <SettingsForm
                    templateInfo={templateInfo}
                    tagOptions={tagOptions}
                    topicOptions={topicOptions}
                    setLoading={setLoading}
                    refreshInfo={initializeComponent}
                    checkAuth={checkAuth} />}
        </>
    )
}

export default TemplateSettings;