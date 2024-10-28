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
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Text,
    Button,
    Flex,
    Avatar,
    Icon,
    Skeleton
} from "@chakra-ui/react";

//Styles imports
import styles from "../shared/styles.module.css";

//Services imports
import { getLatestTemplates } from "../../services/templateService";

//Library imports
import { BiLike, BiChat, BiRightArrowCircle, BiSolidData } from "react-icons/bi";
import Markdown from 'markdown-to-jsx'

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
                        <Card w={"100%"} h={"100%"}
                            sx={{
                                transition: 'all 0.2s ease-in-out'
                            }}
                            _hover={
                                {
                                    transform: 'scale(1.01)'
                                }
                            }>
                            <CardHeader>
                                <Flex gap={4} alignItems='center'>
                                    <Avatar
                                        size='sm'
                                        name={template.user.name}
                                        bg={greenColor}
                                        color={textGreenScheme} />
                                    <Box>
                                        <Heading size='xs'>
                                            {template.user.name}{user?.email === template.user.email ?
                                            language === "es" ? " (Tu)" : " (You)": ""}
                                            </Heading>
                                        <Text fontSize='sm'>{template.user.email}</Text>
                                    </Box>
                                </Flex>
                            </CardHeader>
                            <CardBody py={2}>
                                <Heading
                                    size='md'
                                    color={greenColor}
                                    mb={4} >
                                    {template.title}
                                </Heading>
                                <Box noOfLines={8} className={styles.markdown}>
                                    <Markdown>
                                        {template.description}
                                    </Markdown>
                                </Box>

                            </CardBody>
                            <CardFooter
                                justify='flex-end'
                                flexWrap='wrap' >
                                <Button colorScheme="blue" variant='ghost' leftIcon={<BiLike />}>
                                    {language === "es" ? "Me Gusta" : "Like"}
                                </Button>
                                <Button colorScheme="green" variant='ghost' leftIcon={<BiChat />}>
                                    {language === "es" ? "Comentar" : "Comment"}
                                </Button>
                                <Button
                                    variant='ghost'
                                    leftIcon={<BiRightArrowCircle />}
                                    onClick={() => goTo(`/form-page/${template.id}`)}>
                                    {language === "es" ? "Ir" : "Go to"}
                                </Button>
                            </CardFooter>
                        </Card>
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