//React/Next imports
import { useState, useEffect } from "react";

//Chakra imports
import {
    Skeleton
} from "@chakra-ui/react";

//Components imports
import SettingsForm from "./SettingsForm";

//Services imports
import { getTopics } from "../../../services/topicService";
import { getTags } from "../../../services/tagService";
import { getTemplate } from "../../../services/templateService";
import { getUsers } from "../../../services/userService";

//Context imports
import { useUI } from "../../../context/UIContext";
import { useAuth } from "../../../context/AuthContext";

const TemplateSettings = ({id, checkAuth}) => {
    const { openSimpleErrorModal, setPageLoaded } = useUI();
    const { user } = useAuth();
    const [topicOptions, setTopicOptions] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [templateInfo, setTemplateInfo] = useState(null);

    const getTemplateInfo = async () => {
        const response = await getTemplate(id, "getTemplateSettings");
        if (response.ok) {
            if(response.data)
                setTemplateInfo(response.data);
            else 
                openSimpleErrorModal(
                    { es: "Error al cargar la plantilla", en: "Error at loading template" },
                    () => router.push('/dashboard')
                );
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

    const getUsersOptions = async () => {
        const response = await getUsers("getUsers");
        if (response.ok) {
            const users = response.data.filter((userData) => userData.id_user !== user.id_user)
            .map((user) => {
                return {
                    value: user.id_user,
                    label: user.name + " (" + user.email + ")"
                }
            });
            setUserOptions(users);
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
        await getUsersOptions();
        setLoading(false);
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
                    userOptions={userOptions}
                    refreshInfo={initializeComponent}
                    checkAuth={checkAuth} />}
        </>
    )
}

export default TemplateSettings;