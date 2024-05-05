import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Collapse, FormControlLabel, Grid, IconButton, Paper, Skeleton, Switch, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import Iframe from 'react-iframe';
const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const extractIframe = (text) => {
    const iframeRegex = /<iframe.*?src="(.*?)".*?<\/iframe>/;
    const match = iframeRegex.exec(text);
    if (match) {
        return match[0];
    }
    return null;
};

const NewsCard = ({ newsData, addNewsToAnalize, removeNewsToAnalize, showCardActions }) => {
    const [expanded, setExpanded] = useState(false);
    const [content, setContent] = useState('');
    const [iframe, setIframe] = useState(null);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    useEffect(() => {
        const iframeExtracted = extractIframe(newsData.text);
        const text = iframeExtracted ? newsData.text.replace(iframeExtracted, '').replace("Compartir\nEl código iframe se ha copiado en el portapapeles", '') : newsData.text;
        const iframeSRC = iframeExtracted ? iframeExtracted.match(/src="([^"]+)"/) : "";
        const linesText = text.split('\n')
        const formattedContent = linesText.map((line, index) => line && (
            <span key={index}>
                {line}
                {index !== (linesText.length - 1) ? <br /> : <></>}
            </span>
        ));
        setContent(formattedContent);
        if (iframeExtracted && iframeSRC[1]) {
            setIframe(iframeSRC[1]);
        }
    }, [newsData]);
    const handleSwitch = ({ target }) => {
        if (target.checked) {
            addNewsToAnalize(newsData)
        } else {
            removeNewsToAnalize(newsData)
        }
    }
    return (
        <Card sx={{ display: 'flex', maxWidth: "400px", alignItems: "center", height: "min-content", flexDirection: "column", marginTop: "16px" }}>
            <Box sx={{ display: 'flex', flexDirection: showCardActions ? "column" : 'row' }}>
                {newsData.image && <CardMedia
                    component="img"
                    sx={{ height: "170px", maxWidth: showCardActions ? "100%" : '170px', objectFit: 'fill' }}
                    image={newsData.image}
                    alt={newsData.title}
                />}
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ paddingInline: "10px", paddingTop: "10px", paddingBottom: "0px !important" }}>
                        <Typography gutterBottom variant="h5" component="div" sx={{ marginBottom: "0px" }}>
                            {newsData.title}
                        </Typography>
                        {showCardActions && <Typography variant="body2" color="text.secondary">
                            {newsData.description}
                        </Typography>
                        }
                    </CardContent>
                    {showCardActions &&
                        <CardActions sx={{ paddingBlock: "0px", paddingInline: "10px", justifyContent: "space-between" }}>
                            <Button size="small" href={newsData.link}>Ver noticia</Button>
                            <FormControlLabel control={<Switch onChange={handleSwitch} color='secondary' />} label="Imparcializar" />
                            <ExpandMore
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        </CardActions>
                    }
                </Box>
            </Box>

            <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ maxWidth: "400px", overflow: "auto" }}>
                <CardContent>
                    <Typography paragraph sx={{ marginBottom: "0px" }}>
                        {content}
                    </Typography>
                    {iframe && <Iframe url={iframe}
                        width="100%" />}
                </CardContent>
            </Collapse>
        </Card>
    );
}

export const NewsCardSkeleton = () => {
    return (
        <Paper sx={{ display: 'flex', maxWidth: "400px", height: "min-content", flexDirection: "column", marginTop: "16px", minWidth: "300px" }}>
            <Skeleton variant="rectangular" height={"170px"} />
            <Grid >
                <Typography gutterBottom variant="h5" component="div" sx={{ marginBottom: "0px", marginInline: "10px" }}>
                    <Skeleton height={"50px"} />
                </Typography>
                <Skeleton variant="rectangular" height={"70px"} sx={{ margin: "10px", marginTop: "0px" }} />
            </Grid>
        </Paper>
    )
}
export default NewsCard