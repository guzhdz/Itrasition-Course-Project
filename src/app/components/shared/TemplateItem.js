//Chakra imports
import {
    Box,
    Heading,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Text,
    Button,
    Flex,
    Avatar
} from "@chakra-ui/react";

//Styles imports
import styles from "../shared/styles.module.css";

//Library imports
import { BiLike, BiChat, BiRightArrowCircle } from "react-icons/bi";
import Markdown from 'markdown-to-jsx'

//Context imports
import { useUI } from "../../context/UIContext";
import { useAuth } from "../../context/AuthContext";

function TemplatesResults({template, goTo}) {
    const { language, greenColor, textGreenScheme } = useUI();
    const { user } = useAuth();

    return (
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
                                language === "es" ? " (Tu)" : " (You)" : ""}
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
                <Box noOfLines={8} className={styles.markdown} p={1}>
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
    );
}

export default TemplatesResults;