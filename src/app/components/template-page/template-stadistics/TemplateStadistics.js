//React/Next imports
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

//Chakra imports
import {
    Skeleton,
    Button
} from "@chakra-ui/react";

//Services imports
import { getTemplateStadistics } from "../../../services/templateService";

//Context imports
import { useUI } from "../../../context/UIContext";

const TemplateStadistics = ({ id }) => {
    const router = useRouter();
    const { openSimpleErrorModal, setPageLoaded } = useUI();
    const [loading, setLoading] = useState(true);

    const getStadistics = async () => {
        const response = await getTemplateStadistics(id);
        if (response.ok) {
            console.log(response.data);
        } else {
            setPageLoaded(false);
            openSimpleErrorModal(
                response.message,
                () => router.push('/dashboard')
            );
        }
    }

    const initializeComponent = async () => {
        await getStadistics();
        setLoading(false);
    }

    useEffect(() => {
        initializeComponent();
    }, []);

    return (
        <>
            {loading ? <Skeleton height="700px" />
                : <Button onClick={getStadistics}>Test</Button>}
        </>
    )
}

export default TemplateStadistics;