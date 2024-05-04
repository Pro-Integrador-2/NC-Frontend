
import { AppBar, Box, Container, Grid, IconButton, Paper, Toolbar, Typography } from '@mui/material';
import React from 'react';
import MyIcon from './assets/imageIcon.png';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
function App() {
  const formattedDate = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es });
  return (
    <Box sx={{ maxWidth: '100%' }}>
      <AppBar position="static">
        <Toolbar style={{ backgroundColor: '#313053', height: '70px', alignContent: "space-around", display: 'flex' }}>
          <Grid container alignItems={'center'}>
            <IconButton edge="start" color="inherit" aria-label="menu" >
              <img src={MyIcon} alt="My Icon" style={{ width: '60px', height: '60px' }} />
            </IconButton>
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
        <Grid container spacing={2} sx={{ maxWidth: '100%', margin: "0px", height: '100%' }}>
          <Grid item xs={5}>
            <Paper elevation={3} sx={{ height: '100%', padding: "16px" }}>
              <Typography variant="h5" component="div">
                Noticias Imparciales
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={7} sx={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: "16px" }}>
            <Typography variant="h5" component="div">
              Noticias por Medio de Comunicación
            </Typography>
            {['W Radio', 'Revista Semana', 'La Silla Vacia', 'Noticias Caracol'].map((medio, index) => (
              <Paper elevation={3} key={index} sx={{ padding: '16px', flexGrow: 1 }}>
                <Typography variant="h6" component="div">
                  {medio}
                </Typography>
                <Typography variant="body1" component="p">
                  Contenido de noticias de {medio}...
                </Typography>
              </Paper>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;