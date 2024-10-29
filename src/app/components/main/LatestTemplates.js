"use client"
//React/Next imports
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

//Chakra imports
import {
    Box,
    Heading,
    Wrap,
    WrapItem,
    Text,
    Flex,
    Icon,
    Skeleton
} from "@chakra-ui/react";

//Components imports
import TemplateItem from "../shared/TemplateItem";

//Services imports
import { getLatestTemplates } from "../../services/templateService";

//Library imports
import { BiSolidData } from "react-icons/bi";

//Context imports
import { useUI } from "../../context/UIContext";
import { useAuth } from "../../context/AuthContext";

function LatestTemplates() {
    const router = useRouter();
    const { language, greenColor, textGreenScheme, setPageLoaded } = useUI();
    const { user } = useAuth();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const skeletons = Array(6).fill(null);

    const getTemplates = async () => {
        const response = await getLatestTemplates();
        if (response.ok) {
            setTemplates(response.data);
        } else {
            console.log("Error");
        }
        setLoading(false);
    };

    const goTo = (path) => {
        setPageLoaded(false);
        router.push(path);
    };

    useEffect(() => {
        getTemplates();
    }, []);


    return (
        <Box maxW="2000px" mx="auto" width="85%" p={3} mb={10}>
            <Heading as="h2" mb={14}>{language === "es" ? "Plantillas Recientes" : "Latest Templates"}</Heading>

            <Wrap justify='center' spacing={10}>
                {loading &&
                    skeletons.map((_, index) => (
                        <Skeleton key={index} height="300px" w={"30%"} minW={"320px"} />
                    ))
                }

                {templates.map((template, index) => (
                    <WrapItem key={index} w={"30%"} minW={"320px"}>
                        <TemplateItem 
                        template={template}
                        goTo={goTo} />
                    </WrapItem>
                ))}

                {templates.length === 0 && !loading &&
                    <Flex align="center" direction="column" gap={2}>
                        <Icon as={BiSolidData} boxSize={16} color={greenColor} />
                        <Text fontSize="lg">
                            {language === "es" ? "No hay plantillas recientes" : "No recent templates"}
                        </Text>
                    </Flex>}
            </Wrap>
        </Box>
    );
}

export default LatestTemplates;