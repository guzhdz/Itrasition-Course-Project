//React/Next imports
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

//Chakra imports
import {
    Skeleton
} from "@chakra-ui/react";

//Components imports
import Statistics from "./Stadistics";

//Services imports
import { getTemplateStadistics } from "../../../services/templateService";

//Context imports
import { useUI } from "../../../context/UIContext";

const TemplateStadistics = ({ id }) => {
    const router = useRouter();
    const { openSimpleErrorModal, setPageLoaded } = useUI();
    const [stadistics, setStadistics] = useState([]);
    const [loading, setLoading] = useState(true);

    const getStadistics = async () => {
        const response = await getTemplateStadistics(id);
        if (response.ok) {
            setStadistics(response.data);
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
                : <Statistics  stadistics={stadistics}/>}
        </>
    )
}

export default TemplateStadistics;