//React/Next imports
import { useState, useEffect } from "react";

//Chakra imports
import {
    Skeleton
} from "@chakra-ui/react";

//Components imports
import FillOutForms from "./FillOutForms";

//Services imports
import { getTemplateForms } from "../../../services/formService";

//Context imports
import { useUI } from "../../../context/UIContext";

const TemplateResults = ({ id, checkAuth }) => {
    const { openSimpleErrorModal, setPageLoaded } = useUI();
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);

    const getForms = async () => {
        const response = await getTemplateForms(id);
        if (response.ok) {
           setForms(response.data);
        } else {
            setPageLoaded(false);
            openSimpleErrorModal(
                response.message,
                () => router.push('/dashboard')
            );
        }
    }

    const initializeComponent = async () => {
        await getForms();
        setLoading(false);
    }

    useEffect(() => {
        initializeComponent();
    }, []);

    return (
        <>
            {loading ? <Skeleton height="700px" />
                : <FillOutForms forms={forms} setForms={setForms} />}
        </>
    )
}

export default TemplateResults;