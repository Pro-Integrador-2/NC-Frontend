import { AppBar, Box, Container, Grid, IconButton, Paper, Toolbar, Typography, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useEffect, useRef, useState } from 'react';
import Masonry from 'react-masonry-css';
import NewsCard, { NewsCardSkeleton } from './NewsCard';
import MyIcon from './assets/imageIcon.png';
function App() {
  const formattedDate = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es });
  const isMobileOrTablet = useMediaQuery('(max-width: 900px)');
  const isMobile = useMediaQuery('(max-width: 400px)');
  const firstRender = useRef(true);
  let gettingInfo = false;
  const [newsInformation, setNewsInformation] = useState([
    { mediaName: 'La Silla Vacia', endpoint: '/news/la-silla-vacia', news: [] },
    { mediaName: 'W Radio', endpoint: '/news/w-radio', news: [] },
    { mediaName: 'Noticias Caracol', endpoint: '/news/noticias-caracol', news: [] },
    { mediaName: 'Revista Semana', endpoint: '/news/revista-semana', news: [] },
  ])
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:5000'
  });
  const NewsCardSkeletons = [
    <NewsCardSkeleton key={1} />,
    <NewsCardSkeleton key={2} />,
    <NewsCardSkeleton key={3} />,
    <NewsCardSkeleton key={4} />,
    <NewsCardSkeleton key={5} />,
    <NewsCardSkeleton key={6} />
  ]

  useEffect(() => {
    const getNewsInfo = () => {
      console.log("hola")
      const promisesNews = newsInformation.map((source, index) => {
        return axios.get(`http://127.0.0.1:5000${source.endpoint}`)
          .then(({ data }) => {
            console.log(data)
            setNewsInformation(prevState => {
              console.log({ prevState })
              return prevState.map(item => item.mediaName === source.mediaName ? { ...item, news: data } : item);
            });
          })
          .catch(error => {
            console.error('Error fetching data: ', error);

          });
      });
      //console.log(promisesNews)
    }
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    getNewsInfo()
  }, [])
  return (
    <Box sx={{ maxWidth: '100%' }}>
      <AppBar position="static">
        <Toolbar style={{ backgroundColor: '#313053', height: '70px', alignContent: "space-around", display: 'flex' }}>
          <Grid container alignItems={'center'}>
            {!isMobileOrTablet && <IconButton edge="start" color="inherit" aria-label="menu" >
              <img src={MyIcon} alt="My Icon" style={{ width: '60px', height: '60px' }} />
            </IconButton>}
            <Typography variant="h6" color="#fff" component="div">
              News Collector
            </Typography>
          </Grid>
          <Grid container justifyContent={"flex-end"} alignItems={'center'}>
            <Typography
              variant="h6" color="#fff" component="div"
            >
              {formattedDate}
            </Typography>
          </Grid>
        </Toolbar>
      </AppBar>

      <Container sx={{ display: 'flex', justifyContent: 'center', minWidth: '100%', paddingInline: "0px !important", minHeight: 'calc(100vh - 70px)' }}>
        <Grid container spacing={2} sx={{ maxWidth: '100%', margin: "0px", height: '100%', justifyContent: "center" }}>

          <Grid item sx={{ minWidth: isMobileOrTablet ? "300px" : "450px", height: "min-content", maxHeight: "2400px", alignItems: "center" }}>
            <Paper elevation={3} sx={{ height: '100%', padding: "16px" }}>
              <Typography variant="h5" component="div">
                Noticias Imparciales
              </Typography>
              <NewsCardSkeleton />
              <NewsCardSkeleton />
              <NewsCardSkeleton />
            </Paper>
          </Grid>
          <Grid item sx={{
            minWidth: isMobile ? "300px" : "450px", width: isMobileOrTablet ? "calc(98vw)" : "calc(100vw - 470px)",
            display: 'flex', flexDirection: 'column', gap: '20px', padding: isMobileOrTablet ? "0px" : "16px"
          }}>
            <Typography variant="h5" component="div">
              Noticias por Medio de Comunicación
            </Typography>
            {newsInformation.map((data, index) => (
              <Paper elevation={3} key={index} sx={{ padding: '16px', flexGrow: 1 }}>
                <Typography variant="h6" component="div">
                  {data.mediaName}
                </Typography>
                <Box maxHeight={"500px"} overflow={"auto"}>
                  <Masonry
                    breakpointCols={{
                      default: 3,
                      1750: 2,
                      1350: 1
                    }}
                    className="masonry-grid"
                    columnClassName="masonry-grid_column"
                  >
                    {data.news.length === 0 ? NewsCardSkeletons.map(cardSkeleton => cardSkeleton) : data.news.map(newsData => <NewsCard newsData={newsData} />)}
                  </Masonry>
                </Box>
              </Paper>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;