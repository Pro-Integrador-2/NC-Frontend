import { AppBar, Avatar, Box, Button, Container, Grid, IconButton, Paper, Toolbar, Typography, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { da, es } from 'date-fns/locale';
import React, { useEffect, useRef, useState } from 'react';
import Masonry from 'react-masonry-css';
import NewsCard, { NewsCardSkeleton } from './NewsCard';
import MyIcon from './assets/imageIcon.png';
function App() {
  const formattedDate = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es });
  const isMobileOrTablet = useMediaQuery('(max-width: 900px)');
  const isMobile = useMediaQuery('(max-width: 400px)');
  const firstRender = useRef(true);
  const [newsAnalize, setNewsAnalize] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hideChecked, setHideChecked] = useState(false);

  const [done, setDone] = useState(false);
  const [newsInformation, setNewsInformation] = useState([
    { mediaName: 'La Silla Vacia', endpoint: '/news/la-silla-vacia', news: [], logo: "https://pbs.twimg.com/profile_images/938093053344124928/LhoXiFYA_400x400.jpg" },
    { mediaName: 'Noticias Caracol', endpoint: '/news/noticias-caracol', news: [], logo: "https://pbs.twimg.com/profile_images/1400044712401199108/L1E-ZbwY_400x400.jpg" },
    { mediaName: 'W Radio', endpoint: '/news/w-radio', news: [], logo: "https://pbs.twimg.com/profile_images/1309308671470559234/3EaRd_iK_400x400.jpg" },
    { mediaName: 'Revista Semana', endpoint: '/news/revista-semana', news: [], logo: "https://pbs.twimg.com/profile_images/1229471444394029061/AUEHUy1y_400x400.jpg" },
  ])

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
      const promisesNews = newsInformation.map((source, index) => {
        if (newsInformation[index].news.length !== 0) return;
        return axios.get(`https://nc-backend-orbe.onrender.com/${source.endpoint}`)
          .then(({ data }) => {
            setNewsInformation(prevState => prevState.map(item => item.mediaName === source.mediaName ? { ...item, news: data } : item));
          })
          .catch(error => {
            console.error('Error fetching data: ', error);
          });
      });
    }
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    getNewsInfo()
  }, [])

  const addNewsToAnalize = (news) => {
    setNewsAnalize([...newsAnalize, news])
  }
  const removeNewsToAnalize = (news) => {
    setNewsAnalize(newsAnalize.filter(item => item.title != news.title && item.link != news.link))
  }
  const AnalizeNews = async (e) => {
    setLoading(true)
    await axios.post(`https://nc-backend-orbe.onrender.com`, { news: newsAnalize })
      .then(({ data }) => {
        setNewsAnalize(JSON.parse(data.response.replace(/'/g, '"')))
        setDone(true)
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
    setLoading(false)
  }
  const cleanNews = () => { 
    setNewsAnalize([]); 
    setDone(false)
    setHideChecked(true)
  }

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

          <Grid item sx={{ minWidth: isMobileOrTablet ? "300px" : "450px", height: "min-content", maxHeight: "2400px", alignItems: "center", maxWidth: "450px" }}>
            <Paper elevation={3} sx={{ height: '100%', padding: "16px" }}>
              <Grid item sx={{
                display: 'flex', flexDirection: 'row', gap: '20px'
              }}>
                <Typography variant="h5" component="div">
                  {done ? "Noticias Imparciales" : "Noticias a imparcializar"}
                </Typography>
                <Button variant="contained" color='secondary' onClick={AnalizeNews} sx={{ padding: "5px" }} disabled={newsAnalize.length === 0}>Imparcializar</Button>
              </Grid>

              {loading ?
                <>
                  <NewsCardSkeleton />
                  <NewsCardSkeleton />
                  <NewsCardSkeleton />
                </> : newsAnalize.length === 0 ?
                  <Typography paragraph sx={{ marginBottom: "0px" }}>
                    Selecciona las noticias que desea imparcializar y presiona el botón "Imparcializar".
                  </Typography> :
                  <>
                    {newsAnalize.map((newsData, index) => done ? <NewsCard newsData={newsData} key={index} showCardActions={true} /> : <NewsCard newsData={newsData} key={index} showCardActions={done} />)}
                    <Button fullWidth variant="outlined" color='secondary' onClick={cleanNews} sx={{ padding: "5px", maxWidth: "100px" }} disabled={newsAnalize.length === 0}>Limpiar</Button>
                  </>
              }

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
              <Paper elevation={3} key={index} sx={{ padding: '16px', flexGrow: 1, gap: '10px', display: "flex", flexDirection: "column" }}>
                <Grid item sx={{
                  display: 'flex', flexDirection: 'row', gap: '10px', alignItems: "center"
                }}>
                  <Avatar alt={data.mediaName} src={data.logo} />
                  <Typography variant="h6" component="div">
                    {data.mediaName}
                  </Typography>
                </Grid>
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
                    {data.news.length === 0 ? NewsCardSkeletons.map(cardSkeleton => cardSkeleton) :
                      data.news.map((newsData, index) => 
                      <NewsCard newsData={newsData} addNewsToAnalize={addNewsToAnalize} removeNewsToAnalize={removeNewsToAnalize} key={index} showCardActions={true} hideChecked={!hideChecked}/>)}
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