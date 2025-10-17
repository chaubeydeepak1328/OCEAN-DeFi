import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Dashboard from './pages/Dashboard';
import PortfolioOverview from './pages/PortfolioOverview';
import StakeInvest from './pages/StakeInvest';
import ClaimEarnings from './pages/ClaimEarnings';
import TeamNetwork from './pages/TeamNetwork';
import SlabIncome from './pages/SlabIncome';
import RoyaltyProgram from './pages/RoyaltyProgram';
import OneTimeRewards from './pages/OneTimeRewards';
import SafeWallet from './pages/SafeWallet';
import TransactionHistory from './pages/TransactionHistory';
import Analytics from './pages/Analytics';
import About from './pages/About';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Features from './pages/Features';
import MoneyRevolution from './pages/MoneyRevolution';
import BlockchainBasics from './pages/BlockchainBasics';
import SmartContracts from './pages/SmartContracts';
import WhatIsDefi from './pages/WhatIsDefi';
import RamesttaBlockchain from './pages/RamesttaBlockchain';
import RamaTokenomics from './pages/RamaTokenomics';
import ValidatorSecurity from './pages/ValidatorSecurity';
import AboutPublic from './pages/AboutPublic';
import Presentation from './pages/Presentation';
import OceanDefiGuide from './pages/OceanDefiGuide';

const Approute = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<AboutPublic />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Education Pages - Organized Learning Path */}
        <Route path="/money-revolution" element={<MoneyRevolution />} />
        <Route path="/blockchain-basics" element={<BlockchainBasics />} />
        <Route path="/smart-contracts" element={<SmartContracts />} />
        <Route path="/what-is-defi" element={<WhatIsDefi />} />
        <Route path="/ramestta-blockchain" element={<RamesttaBlockchain />} />
        <Route path="/rama-tokenomics" element={<RamaTokenomics />} />
        <Route path="/validator-security" element={<ValidatorSecurity />} />

        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="portfolio" element={<PortfolioOverview />} />
          <Route path="stake" element={<StakeInvest />} />
          <Route path="earnings" element={<ClaimEarnings />} />
          <Route path="team" element={<TeamNetwork />} />
          <Route path="slab" element={<SlabIncome />} />
          <Route path="royalty" element={<RoyaltyProgram />} />
          <Route path="rewards" element={<OneTimeRewards />} />
          <Route path="safe-wallet" element={<SafeWallet />} />
          <Route path="transaction-history" element={<TransactionHistory />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="about" element={<About />} />
          <Route path="presentation" element={<Presentation />} />
          <Route path="ocean-defi-guide" element={<OceanDefiGuide />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Approute