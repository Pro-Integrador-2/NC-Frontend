import { Box, Button, Card, CardActions, CardContent, CardMedia, Collapse, Grid, IconButton, Paper, Skeleton, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
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


const NewsCard = ({ newsData }) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ display: 'flex', maxWidth: "400px", alignItems: "center", height: "min-content", flexDirection: "column", marginTop: "16px" }}>
            <Box>
                <CardMedia
                    component="img"
                    sx={{ height: "170px" }}
                    image={newsData.image}
                    alt={newsData.title}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ paddingBottom: "0px", paddingInline: "10px", paddingTop: "10px" }}>
                        <Typography gutterBottom variant="h5" component="div" sx={{ marginBottom: "0px" }}>
                            {newsData.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {newsData.description}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ paddingBlock: "0px", paddingInline: "10px" }}>
                        <Button size="small" href={newsData.link}>Ver noticia</Button>
                        <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </CardActions>

                </Box>
            </Box>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>
                        {newsData.text}
                    </Typography>
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