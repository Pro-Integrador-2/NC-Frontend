import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Collapse, FormControlLabel, Grid, IconButton, Paper, Skeleton, Switch, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import Iframe from 'react-iframe';

/** 
* Componente ExpandMore: Controla la expansión del detalle de las noticias en un Card.
*/
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

/**
 * Función extractIframe: Extrae el contenido de un iframe dentro del texto de la noticia.
 * @param {string} text - Texto que puede contener un iframe.
 * @returns {string|null} - Retorna el iframe extraído o null si no encuentra ninguno.
 */
const extractIframe = (text) => {
    const iframeRegex = /<iframe.*?src="(.*?)".*?<\/iframe>/;
    const match = iframeRegex.exec(text);
    if (match) {
        return match[0];
    }
    return null;
};


/**
 * Componente NewsCard: Muestra la información detallada de una noticia.
 * Permite al usuario seleccionar noticias para imparcializar y las envía al backend para su procesamiento.
 * @param {object} newsData - Datos de la noticia.
 * @param {function} addNewsToAnalize - Función para agregar noticias a la lista de análisis.
 * @param {function} removeNewsToAnalize - Función para remover noticias de la lista de análisis.
 * @param {boolean} showCardActions - Indica si se deben mostrar acciones adicionales en la tarjeta.
 * @param {boolean} hideChecked - Controla la visibilidad del selector para imparcializar.
 */
const NewsCard = ({ newsData, addNewsToAnalize, removeNewsToAnalize, showCardActions, hideChecked }) => {
    const [expanded, setExpanded] = useState(false);
    const [content, setContent] = useState('');
    const [iframe, setIframe] = useState(null);
    const [showSelect, setShowSelect] = useState(false);
    const handleExpandClick = () => {
        setShowSelect(false)
        setExpanded(!expanded);
    };
    useEffect(() => {
        setShowSelect(false);
    }, [hideChecked]);
    
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
        setShowSelect(target.checked)
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
                    loading='lazy'
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
                            {addNewsToAnalize && <FormControlLabel control={<Switch inputProps={{ 'aria-label': 'controlled' }} checked={showSelect} onChange={handleSwitch} color='secondary' />} label="Imparcializar" />}
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

/**
 * Componente NewsCardSkeleton: Proporciona un esqueleto para las NewsCard mientras las noticias están cargando.
 */
export const NewsCardSkeleton = () => {
    return (
        <Paper sx={{ display: 'flex', maxWidth: "400px", height: "min-content", flexDirection: "column", marginTop: "16px", minWidth: "300px" }}  data-testid="news-card-skeleton">
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