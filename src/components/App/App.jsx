import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { css } from '@emotion/core';
import {
  Container,
  Typography,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Grid,
} from '@material-ui/core';
import {
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
} from '@material-ui/icons';

import { symbolByCurrency } from 'constants';
import PriceCard from './PriceCard';
import FeeCard from './FeeCard';

const App = (props) => {
  const { className } = props;

  const [currency, setCurrency] = useState('usd');
  useEffect(() => {
    if (localStorage.getItem('currency')) {
      setCurrency(localStorage.getItem('currency'));
    }
  }, []);
  const handleCurrencySelectChange = useCallback((e) => {
    setCurrency(e.target.value);
    localStorage.setItem('currency', e.target.value);
  }, []);

  const [
    isFetchingEthPriceByCurrency,
    setIsFetchingEthPriceByCurrency,
  ] = useState(true);
  const [ethPriceByCurrency, setEthPriceByCurrency] = useState({ usd: 400 });
  useEffect(() => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${Object.keys(
          symbolByCurrency,
        ).join(',')}`,
      )
      .then((res) => {
        setEthPriceByCurrency((prev) => ({ ...prev, ...res.data.ethereum }));
      })
      .then(() => {
        setIsFetchingEthPriceByCurrency(false);
      });
  }, []);

  const [isFetchingGasNow, setIsFetchingGasNow] = useState(true);
  const [gasNow, setGasNow] = useState({});
  useEffect(() => {
    axios
      .get(`${process.env.API_ORIGIN}/api/gas/now`)
      .then((res) => {
        setGasNow(res.data);
      })
      .then(() => {
        setIsFetchingGasNow(false);
      });
  }, []);

  const [isFetchingGass, setIsFetchingGass] = useState(true);
  const [gass, setGass] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.API_ORIGIN}/api/gas`)
      .then((res) => {
        setGass(res.data);
      })
      .then(() => {
        setIsFetchingGass(false);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>Feel the Fee</title>
        <meta name="title" content="Feel the Fee" />
        <meta
          name="description"
          content="How much gas fee will it cost to do some yield farming on Yearn/Curve/Balancer? How much gas fee do I need to pay to swap a coin on Uniswap? Check out real-time gas fees on Ethereum in whatever currency you like right now!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fee.finance/" />
        <meta property="og:title" content="Feel the Fee" />
        <meta
          property="og:description"
          content="How much gas fee will it cost to do some yield farming on Yearn/Curve/Balancer? How much gas fee do I need to pay to swap a coin on Uniswap? Check out real-time gas fees on Ethereum in whatever currency you like right now!"
        />
        {/* <meta property="og:image" content="" /> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fee.finance/" />
        <meta property="twitter:title" content="Feel the Fee" />
        <meta
          property="twitter:description"
          content="How much gas fee will it cost to do some yield farming on Yearn/Curve/Balancer? How much gas fee do I need to pay to swap a coin on Uniswap? Check out real-time gas fees on Ethereum in whatever currency you like right now!"
        />
        {/* <meta property="twitter:image" content="" /> */}

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />

        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
        />
        <script>
          {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${process.env.GA_TRACKING_ID}');
          `}
        </script>
      </Helmet>
      <div className={className}>
        <Container>
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
              padding: 20px 0;
            `}
          >
            <Typography variant="h4" align="center">
              ⛽ Feel the Fee
            </Typography>
            <FormControl variant="outlined">
              <Select value={currency} onChange={handleCurrencySelectChange}>
                {Object.keys(symbolByCurrency).map((k) => (
                  <MenuItem key={k} value={k}>
                    {k.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <main>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <PriceCard isFetching={isFetchingGasNow} gasNow={gasNow} />
              </Grid>
              <Grid item xs={12} md={6}>
                <FeeCard
                  isFetching={isFetchingGass || isFetchingEthPriceByCurrency}
                  gas={gass[gass.length - 1]}
                  ethPrice={ethPriceByCurrency[currency]}
                  currency={currency}
                />
              </Grid>
            </Grid>
          </main>
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 20px;
            `}
          >
            <div
              css={css`
                display: flex;
              `}
            >
              <IconButton
                size="small"
                href="https://twitter.com/harry830622"
                target="_blank"
                rel="noopener"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                size="small"
                href="https://github.com/harry830622/feel-the-fee"
                target="_blank"
                rel="noopener"
              >
                <GitHubIcon />
              </IconButton>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

App.propTypes = {
  className: PropTypes.string.isRequired,
};

export default App;