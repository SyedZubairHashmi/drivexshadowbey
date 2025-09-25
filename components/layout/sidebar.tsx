"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { 
    name: "Dashboard ", 
    href: "/dashboard", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" fill="none">
        <g clipPath="url(#clip0_2141_2806)">
          <path d="M10.553 21.3063C8.53322 21.3063 6.51329 21.3075 4.49347 21.306C2.45969 21.3045 1.00318 19.8436 1.0017 17.8017C0.999794 15.1937 1.00402 12.5857 1.00001 9.97776C0.997996 8.6907 1.5134 7.68796 2.57381 6.96145C4.54879 5.60839 6.51837 4.24745 8.49017 2.8896C9.90903 1.91262 11.2537 1.91517 12.6709 2.89268C14.6306 4.24436 16.5886 5.59881 18.5546 6.94122C19.629 7.67486 20.1562 8.68208 20.1538 9.98543C20.1491 12.58 20.1536 15.1747 20.152 17.7692C20.1507 19.8457 18.7067 21.3046 16.6525 21.3059C14.6193 21.3072 12.5862 21.3062 10.553 21.3062V21.3063Z" stroke="black" strokeWidth="1.4" strokeMiterlimit="10"/>
          <path opacity="0.5" d="M7.53125 17.4659H14.4701" stroke="black" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"/>
        </g>
        <defs>
          <clipPath id="clip0_2141_2806">
            <rect width="22" height="22" fill="white" transform="translate(0 0.732422)"/>
          </clipPath>
        </defs>
      </svg>
    )
  },
  {
    name: "Cars Management",
    href: "/cars",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
        <path d="M13.4495 0.399109C13.9602 0.399126 14.4607 0.541315 14.8951 0.809747C15.3295 1.07818 15.6805 1.46225 15.909 1.91894L17.1767 4.45353C17.4004 4.36186 17.6231 4.26927 17.8395 4.16202C18.0571 4.05335 18.3089 4.03557 18.5396 4.11258C18.7703 4.1896 18.961 4.3551 19.0696 4.57269C19.1783 4.79028 19.1961 5.04213 19.1191 5.27283C19.0421 5.50353 18.8766 5.69419 18.659 5.80286C18.2061 6.02836 17.999 6.09803 17.999 6.09803L18.8753 7.85161C19.0669 8.23386 19.1659 8.65461 19.1659 9.08178V11.3991C19.1659 11.786 19.0842 12.1686 18.9263 12.5218C18.7683 12.875 18.5376 13.1908 18.2492 13.4488V14.6074C18.2492 14.9721 18.1043 15.3218 17.8465 15.5797C17.5886 15.8376 17.2389 15.9824 16.8742 15.9824C16.5095 15.9824 16.1598 15.8376 15.9019 15.5797C15.6441 15.3218 15.4992 14.9721 15.4992 14.6074V14.1491H4.49921V14.6074C4.49921 14.9721 4.35435 15.3218 4.09648 15.5797C3.83862 15.8376 3.48889 15.9824 3.12421 15.9824C2.75954 15.9824 2.4098 15.8376 2.15194 15.5797C1.89408 15.3218 1.74921 14.9721 1.74921 14.6074V13.4488C1.18638 12.9446 0.832546 12.2131 0.832546 11.3991V9.08178C0.832717 8.65503 0.932202 8.23418 1.12313 7.85252L1.99946 6.09803C1.77736 6.00612 1.55789 5.908 1.3413 5.80378C1.23325 5.75017 1.13684 5.67577 1.0576 5.58483C0.978361 5.4939 0.917846 5.38822 0.879526 5.27385C0.841205 5.15948 0.825831 5.03868 0.834286 4.91836C0.842741 4.79804 0.874858 4.68058 0.928796 4.57269C1.03969 4.35606 1.23142 4.19181 1.4625 4.11547C1.69358 4.03913 1.94543 4.05684 2.16355 4.16478C2.37988 4.26866 2.59927 4.36491 2.82171 4.45353L4.08946 1.91894C4.31788 1.46225 4.66895 1.07818 5.10333 0.809747C5.53771 0.541315 6.03825 0.399126 6.54888 0.399109H13.4495ZM16.2637 6.72778C14.7054 7.22003 12.488 7.73244 9.99921 7.73244C7.51046 7.73244 5.29305 7.21911 3.73471 6.72778L2.76305 8.67111C2.69916 8.79858 2.66589 8.93919 2.66588 9.08178V11.3991C2.66588 11.6422 2.76246 11.8754 2.93436 12.0473C3.10627 12.2192 3.33943 12.3158 3.58255 12.3158H16.4159C16.659 12.3158 16.8922 12.2192 17.0641 12.0473C17.236 11.8754 17.3325 11.6422 17.3325 11.3991V9.08178C17.3324 8.9395 17.2991 8.79922 17.2354 8.67202L16.2637 6.72778ZM5.87421 8.64911C6.23889 8.64911 6.58862 8.79397 6.84648 9.05184C7.10435 9.3097 7.24921 9.65944 7.24921 10.0241C7.24921 10.3888 7.10435 10.7385 6.84648 10.9964C6.58862 11.2542 6.23889 11.3991 5.87421 11.3991C5.50954 11.3991 5.1598 11.2542 4.90194 10.9964C4.64408 10.7385 4.49921 10.3888 4.49921 10.0241C4.49921 9.65944 4.64408 9.3097 4.90194 9.05184C5.1598 8.79397 5.50954 8.64911 5.87421 8.64911ZM14.1242 8.64911C14.4889 8.64911 14.8386 8.79397 15.0965 9.05184C15.3543 9.3097 15.4992 9.65944 15.4992 10.0241C15.4992 10.3888 15.3543 10.7385 15.0965 10.9964C14.8386 11.2542 14.4889 11.3991 14.1242 11.3991C13.7595 11.3991 13.4098 11.2542 13.1519 10.9964C12.8941 10.7385 12.7492 10.3888 12.7492 10.0241C12.7492 9.65944 12.8941 9.3097 13.1519 9.05184C13.4098 8.79397 13.7595 8.64911 14.1242 8.64911ZM13.4495 2.23244H6.54888C6.37869 2.23253 6.21188 2.28 6.06715 2.36953C5.92241 2.45906 5.80545 2.58712 5.72938 2.73936L4.56521 5.06494C5.98421 5.49119 7.89638 5.89911 9.99921 5.89911C12.102 5.89911 14.0142 5.49119 15.4323 5.06494L14.269 2.73936C14.193 2.58712 14.076 2.45906 13.9313 2.36953C13.7865 2.28 13.6197 2.23253 13.4495 2.23244Z" fill="black"/>
      </svg>
    ),
    submenu: [
      { name: "Inventory", href: "/cars/inventory" },
      { name: "Batch Insights", href: "/cars/batch-insight" },
      { name: "Vehicles in  Transit", href: "/cars/transit" },
      { name: "Sold Cars", href: "/cars/sold" },
    ],
  },
  {
    name: "Sales & Payments",
    href: "/sales-and-payments",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" fill="none">
        <path d="M8.43411 17.7213V12.588C8.43411 11.6429 7.66802 10.8769 6.723 10.8769H5.01189C4.06687 10.8769 3.30078 11.6429 3.30078 12.588V17.7213C3.30078 18.6663 4.06687 19.4324 5.01189 19.4324H6.723C7.66802 19.4324 8.43411 18.6663 8.43411 17.7213ZM8.43411 17.7213V9.16574C8.43411 8.22072 9.20021 7.45463 10.1452 7.45463H11.8563C12.8014 7.45463 13.5674 8.22072 13.5674 9.16574V17.7213M8.43411 17.7213C8.43411 18.6663 9.20021 19.4324 10.1452 19.4324H11.8563C12.8014 19.4324 13.5674 18.6663 13.5674 17.7213M13.5674 17.7213V5.74352C13.5674 4.7985 14.3335 4.03241 15.2786 4.03241H16.9897C17.9347 4.03241 18.7008 4.7985 18.7008 5.74352V17.7213C18.7008 18.6663 17.9347 19.4324 16.9897 19.4324H15.2786C14.3335 19.4324 13.5674 18.6663 13.5674 17.7213Z" stroke="black" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    submenu: [
      { name: "Customers", href: "/sales-and-payments/customers" },
      { name: "Remaining Balance", href: "/sales-and-payments/remaining-balance" },
      { name: "Invoices & Receipts", href: "/sales-and-payments/invoice" },
    ],
  },
  {
    name: "Investors",
    href: "/investors/batch-investment",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" fill="none">
        <path d="M2.0625 9.74628H19.9375M6.03472 14.7116H7.02778M11 14.7116H11.9931M5.04167 18.6838H16.9583C18.6037 18.6838 19.9375 17.35 19.9375 15.7046V7.76017C19.9375 6.11482 18.6037 4.78101 16.9583 4.78101H5.04167C3.39632 4.78101 2.0625 6.11482 2.0625 7.76017V15.7046C2.0625 17.35 3.39632 18.6838 5.04167 18.6838Z" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    submenu: [
      { name: "Batch Investment", href: "/investors/batch-investment" },
      { name: "Profit Distribution", href: "/investors/profit-distribution" },
    ],
  },
  { 
    name: "Analytics", 
    href: "/analytics", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" fill="none">
        <path d="M10.0833 3.53271C5.95838 3.98871 2.75 7.48586 2.75 11.7324C2.75 16.2887 6.44365 19.9824 11 19.9824C15.2465 19.9824 18.7437 16.774 19.1996 12.649H10.0833V3.53271Z" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18.7805 8.98242H13.75V3.95203C16.0941 4.78054 17.9519 6.63836 18.7805 8.98242Z" stroke="black" strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  { 
    name: "Settings", 
    href: "/setting", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" fill="none">
        <path d="M9.56741 5.1595C9.93222 3.65679 12.0693 3.65679 12.4342 5.1595C12.6698 6.13023 13.782 6.5909 14.635 6.07113C15.9556 5.26652 17.4667 6.77769 16.6621 8.09823C16.1423 8.95128 16.603 10.0634 17.5738 10.2991C19.0765 10.6639 19.0765 12.801 17.5738 13.1658C16.603 13.4015 16.1423 14.5137 16.6621 15.3667C17.4667 16.6872 15.9556 18.1984 14.635 17.3938C13.782 16.874 12.6698 17.3347 12.4342 18.3054C12.0693 19.8081 9.93222 19.8081 9.56741 18.3054C9.33174 17.3347 8.21959 16.874 7.36654 17.3938C6.04601 18.1984 4.53483 16.6872 5.33944 15.3667C5.85921 14.5137 5.39854 13.4015 4.42781 13.1658C2.9251 12.801 2.9251 10.6639 4.42781 10.2991C5.39854 10.0634 5.85921 8.95128 5.33944 8.09823C4.53483 6.77769 6.04601 5.26651 7.36654 6.07113C8.21959 6.5909 9.33174 6.13023 9.56741 5.1595Z" stroke="black" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.5674 11.7325C13.5674 13.15 12.4183 14.2991 11.0008 14.2991C9.58325 14.2991 8.43411 13.15 8.43411 11.7325C8.43411 10.3149 9.58325 9.1658 11.0008 9.1658C12.4183 9.1658 13.5674 10.3149 13.5674 11.7325Z" stroke="black" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
];

export function Sidebar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const pathname = usePathname();

  // Add hidden scrollbar styles with smooth scrolling
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 0px;
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: transparent;
    }
    .custom-scrollbar {
      -ms-overflow-style: none;  /* Internet Explorer 10+ */
      scrollbar-width: none;  /* Firefox */
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch; /* iOS smooth scrolling */
    }
    .custom-scrollbar * {
      scroll-behavior: smooth;
    }
    
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
  `;

  const toggleSubmenu = (itemName: string) => {
    setOpenSubmenus((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      <div 
        style={{
          display: 'flex',
          height: '100vh',
          padding: '24px 14px 40px 14px',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
          backgroundColor: '#F5F7F9',
        }}
      >
      {/* Top Section - Logo and Add Sold Car Button */}
      <div 
        style={{
          display: 'flex',
          width: '262px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        {/* Header with Logo */}
        <div 
          style={{
            padding: '0px 14px 0px 5px',
          }}
        >
          <div 
            className="flex items-center gap-2"
            style={{
              width: '160px',
              height: '28.732px',
              aspectRatio: '160.00/28.73',
            }}
          >
            {/* <span className="text-black font-semibold">Drive</span> */}
            <svg xmlns="http://www.w3.org/2000/svg" width="160" height="31" viewBox="0 0 160 31" fill="none">
              <path d="M6.84702 25.4749H0V6.18508H6.84702C12.586 6.18508 15.6828 10.2461 15.6828 15.8018C15.6828 21.3857 12.586 25.4749 6.84702 25.4749ZM2.64221 8.413V23.247H6.76179C10.7109 23.247 13.0406 20.5114 13.0406 15.8018C13.0406 11.0921 10.7109 8.413 6.76179 8.413H2.64221Z" fill="black"/>
              <path d="M20.9142 25.4749H18.3572V10.9229H20.9142V13.7149C21.6813 12.3612 22.7609 11.4588 24.011 11.0357C24.5508 10.7537 25.1758 10.6127 25.8861 10.6127V13.0098C25.1474 12.9816 24.4371 13.1509 23.8405 13.4329C22.1642 14.1097 20.9142 15.689 20.9142 18.1425V25.4749Z" fill="black"/>
              <path d="M30.3785 8.80782H27.6795V6.29789H30.3785V8.80782ZM30.2933 25.4749H27.7363V10.9229H30.2933V25.4749Z" fill="black"/>
              <path d="M40.1758 25.4749H37.3348L32.1356 10.9229H34.7494L38.7837 22.4573L42.9033 10.9229H45.4319L40.1758 25.4749Z" fill="black"/>
              <path d="M53.4419 23.7546C55.4875 23.7828 57.1638 22.683 57.7604 20.5678H60.1469C59.4366 24.1776 56.766 25.7569 53.3851 25.7851C49.1519 25.8415 46.1688 22.5701 46.1688 18.1989C46.1688 14.1379 48.7826 10.6127 53.2147 10.6127C57.9593 10.6127 60.1185 14.0533 60.289 18.3963H48.6973C48.7257 21.3293 50.7429 23.7546 53.4419 23.7546ZM48.8394 16.7042H57.6183C57.1638 14.3917 55.5728 12.6996 53.1862 12.6996C50.885 12.6996 49.2371 14.3917 48.8394 16.7042Z" fill="black"/>
              <path d="M72.3833 21.6395C71.5026 23.1906 71.4742 24.3186 71.9288 25.4749H67.2978L74.3153 15.971L67.9796 5.73386H75.054C74.4857 6.72091 74.5426 7.59516 75.4801 9.11804L77.895 13.038L79.827 9.82308C80.8214 8.18739 80.8782 7.08753 80.4236 5.73386H84.7989L78.4633 13.9687L85.5376 25.4749H78.5485C79.0031 24.4032 78.9178 23.388 77.8666 21.6959L74.9119 16.9581L72.3833 21.6395Z" fill="black"/>
              <path d="M100.57 25.4749H93.7226V6.18508H100.57C106.309 6.18508 109.405 10.2461 109.405 15.8018C109.405 21.3857 106.309 25.4749 100.57 25.4749ZM96.3648 8.413V23.247H100.484C104.433 23.247 106.763 20.5114 106.763 15.8018C106.763 11.0921 104.433 8.413 100.484 8.413H96.3648Z" fill="black"/>
              <path d="M118.643 23.7546C120.688 23.7828 122.364 22.683 122.961 20.5678H125.348C124.637 24.1776 121.967 25.7569 118.586 25.7851C114.353 25.8415 111.369 22.5701 111.369 18.1989C111.369 14.1379 113.983 10.6127 118.415 10.6127C123.16 10.6127 125.319 14.0533 125.49 18.3963H113.898C113.926 21.3293 115.944 23.7546 118.643 23.7546ZM114.04 16.7042H122.819C122.364 14.3917 120.773 12.6996 118.387 12.6996C116.086 12.6996 114.438 14.3917 114.04 16.7042Z" fill="black"/>
              <path d="M140.796 25.3339L139.518 25.4185C137.955 25.5595 137.188 24.5161 137.188 23.4162V22.683C135.853 24.8545 134.489 25.7287 132.245 25.7851C129.602 25.8697 127.131 24.4314 127.131 21.4703C127.131 17.7477 130.341 16.6196 133.182 16.6196H136.194C136.819 16.6196 137.16 16.2812 137.131 15.689C137.103 13.2637 135.114 12.8124 133.75 12.8124C132.33 12.8124 130.199 13.1791 130.199 15.6326H127.812C127.812 11.9664 130.852 10.6409 133.807 10.6409C136.762 10.6409 139.489 11.9664 139.489 15.4634V22.6266C139.489 23.247 139.773 23.4162 140.171 23.4162C140.37 23.4162 140.597 23.388 140.825 23.3316L140.796 25.3339ZM137.131 19.8346V18.3681H133.211C131.676 18.3681 129.716 18.9604 129.744 21.2165C129.744 22.9932 131.193 23.7828 132.841 23.7546C135.114 23.7264 137.131 21.8369 137.131 19.8346Z" fill="black"/>
              <path d="M145.684 25.4749H143.127V4.38019H145.684V25.4749Z" fill="black"/>
              <path d="M148.352 21.5549H150.738C151.022 23.3034 152.528 23.8392 154.176 23.8392C155.994 23.8392 157.415 23.2188 157.415 21.6113C157.415 20.5678 156.818 19.9474 155.255 19.5526L152.329 18.7347C150.113 18.1425 148.607 17.0709 148.607 14.8993C148.607 11.8254 151.193 10.6127 154.176 10.6127C157.756 10.6127 159.83 12.2766 159.915 14.8711H157.5C157.301 13.0944 155.824 12.5022 154.091 12.5304C152.5 12.5586 151.193 13.2073 151.193 14.8147C151.193 15.8582 152.017 16.4786 153.551 16.8734L156.307 17.6349C158.494 18.2271 160 19.2988 160 21.4421C160 24.5443 157.301 25.7569 154.318 25.7569C150.71 25.7569 148.38 24.1776 148.352 21.5549Z" fill="black"/>
              <path d="M75.3193 5.39258L75.2334 5.54199C74.9535 6.02909 74.8314 6.48058 74.8896 6.99512C74.9485 7.51389 75.1913 8.10725 75.6631 8.875L78.0244 12.7148L79.8984 9.5918L80.0742 9.29004C80.4596 8.5997 80.6668 8.00839 80.7373 7.44824C80.8177 6.80915 80.7212 6.20195 80.4941 5.52441L80.4492 5.39258H85.2256L85.1025 5.55273L78.7217 13.8584L85.8564 25.4814L85.9502 25.6338H78.5371L78.5957 25.4951C78.82 24.9654 78.9102 24.4541 78.8164 23.8672C78.7339 23.3509 78.5082 22.7704 78.0986 22.0615L77.9121 21.75L75.0078 17.0859L72.5273 21.6875L72.5264 21.6895C72.0849 22.4682 71.8603 23.1349 71.8008 23.7471C71.7415 24.3582 71.8465 24.922 72.0723 25.4971L72.125 25.6338H67.0869L67.2051 25.4746L74.2764 15.8799L67.8916 5.54492L67.7969 5.39258H75.3193Z" fill="url(#paint0_linear_2141_2791)" stroke="url(#paint1_linear_2141_2791)" strokeWidth="0.2"/>
              <g filter="url(#filter0_f_2141_2791)">
                <path d="M72.4395 21.6399C71.5469 23.2146 71.5181 24.3598 71.9788 25.5337H67.2852L74.3976 15.8851L67.9762 5.49219H75.1463C74.5703 6.49426 74.6279 7.38181 75.5782 8.92787L78.0258 12.9075L79.9839 9.64364C80.9917 7.98306 81.0493 6.86646 80.5886 5.49219H85.023L78.6017 13.8524L85.7717 25.5337H78.6881C79.1488 24.4457 79.0624 23.415 77.997 21.6972L75.0023 16.8872L72.4395 21.6399Z" fill="url(#paint2_linear_2141_2791)"/>
                <path d="M75.3193 5.39258L75.2334 5.54199C74.9535 6.02909 74.8314 6.48058 74.8896 6.99512C74.9485 7.51389 75.1913 8.10725 75.6631 8.875L78.0244 12.7148L79.8984 9.5918L80.0742 9.29004C80.4596 8.5997 80.6668 8.00839 80.7373 7.44824C80.8177 6.80915 80.7212 6.20195 80.4941 5.52441L80.4492 5.39258H85.2256L85.1025 5.55273L78.7217 13.8584L85.8564 25.4814L85.9502 25.6338H78.5371L78.5957 25.4951C78.82 24.9654 78.9102 24.4541 78.8164 23.8672C78.7339 23.3509 78.5082 22.7704 78.0986 22.0615L77.9121 21.75L75.0078 17.0859L72.5273 21.6875L72.5264 21.6895C72.0849 22.4682 71.8603 23.1349 71.8008 23.7471C71.7415 24.3582 71.8465 24.922 72.0723 25.4971L72.125 25.6338H67.0869L67.2051 25.4746L74.2764 15.8799L67.8916 5.54492L67.7969 5.39258H75.3193Z" stroke="url(#paint3_linear_2141_2791)" strokeWidth="0.2"/>
              </g>
              <g style={{mixBlendMode: "color-dodge"}}>
                <g clipPath="url(#paint4_diamond_2141_2791_clip_path)" data-figma-skip-parse="true"><g transform="matrix(0 0.00417269 -0.00417269 0 67.3094 5.17269)"><rect x="0" y="0" width="1239.65" height="1239.65" fill="url(#paint4_diamond_2141_2791)" opacity="1" shapeRendering="crispEdges"/><rect x="0" y="0" width="1239.65" height="1239.65" transform="scale(1 -1)" fill="url(#paint4_diamond_2141_2791)" opacity="1" shapeRendering="crispEdges"/><rect x="0" y="0" width="1239.65" height="1239.65" transform="scale(-1 1)" fill="url(#paint4_diamond_2141_2791)" opacity="1" shapeRendering="crispEdges"/><rect x="0" y="0" width="1239.65" height="1239.65" transform="scale(-1)" fill="url(#paint4_diamond_2141_2791)" opacity="1" shapeRendering="crispEdges"/></g></g><ellipse cx="67.3094" cy="5.17269" rx="4.17269" ry="4.17269" data-figma-gradient-fill="{&quot;type&quot;:&quot;GRADIENT_DIAMOND&quot;,&quot;stops&quot;:[{&quot;color&quot;:{&quot;r&quot;:1.0,&quot;g&quot;:1.0,&quot;b&quot;:1.0,&quot;a&quot;:1.0},&quot;position&quot;:0.0},{&quot;color&quot;:{&quot;r&quot;:0.0,&quot;g&quot;:0.0,&quot;b&quot;:0.0,&quot;a&quot;:1.0},&quot;position&quot;:1.0}],&quot;stopsVar&quot;:[],&quot;transform&quot;:{&quot;m00&quot;:5.1100767141934933e-16,&quot;m01&quot;:-8.3453884124755859,&quot;m02&quot;:71.482109069824219,&quot;m10&quot;:8.3453893661499023,&quot;m11&quot;:5.1100772435890853e-16,&quot;m12&quot;:1.0},&quot;opacity&quot;:1.0,&quot;blendMode&quot;:&quot;NORMAL&quot;,&quot;visible&quot;:true}"/>
              </g>
              <g style={{mixBlendMode: "color-dodge"}} opacity="0.6">
                <g clipPath="url(#paint5_diamond_2141_2791_clip_path)" data-figma-skip-parse="true"><g transform="matrix(0 0.00417269 -0.00417269 0 85.7977 25.5598)"><rect x="0" y="0" width="1239.65" height="1239.65" fill="url(#paint5_diamond_2141_2791)" opacity="1" shapeRendering="crispEdges"/><rect x="0" y="0" width="1239.65" height="1239.65" transform="scale(1 -1)" fill="url(#paint5_diamond_2141_2791)" opacity="1" shapeRendering="crispEdges"/><rect x="0" y="0" width="1239.65" height="1239.65" transform="scale(-1 1)" fill="url(#paint5_diamond_2141_2791)" opacity="1" shapeRendering="crispEdges"/><rect x="0" y="0" width="1239.65" height="1239.65" transform="scale(-1)" fill="url(#paint5_diamond_2141_2791)" opacity="1" shapeRendering="crispEdges"/></g></g><ellipse cx="85.7977" cy="25.5598" rx="4.17269" ry="4.17269" data-figma-gradient-fill="{&quot;type&quot;:&quot;GRADIENT_DIAMOND&quot;,&quot;stops&quot;:[{&quot;color&quot;:{&quot;r&quot;:1.0,&quot;g&quot;:1.0,&quot;b&quot;:1.0,&quot;a&quot;:1.0},&quot;position&quot;:0.0},{&quot;color&quot;:{&quot;r&quot;:0.0,&quot;g&quot;:0.0,&quot;b&quot;:0.0,&quot;a&quot;:1.0},&quot;position&quot;:1.0}],&quot;stopsVar&quot;:[],&quot;transform&quot;:{&quot;m00&quot;:5.1100767141934933e-16,&quot;m01&quot;:-8.3453884124755859,&quot;m02&quot;:89.970390319824219,&quot;m10&quot;:8.3453893661499023,&quot;m11&quot;:5.1100772435890853e-16,&quot;m12&quot;:21.387145996093750},&quot;opacity&quot;:1.0,&quot;blendMode&quot;:&quot;NORMAL&quot;,&quot;visible&quot;:true}"/>
              </g>
              <defs>
                <filter id="filter0_f_2141_2791" x="61.6906" y="0.0921755" width="29.6383" height="30.8415" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                  <feGaussianBlur stdDeviation="2.6" result="effect1_foregroundBlur_2141_2791"/>
                </filter>
                <clipPath id="paint4_diamond_2141_2791_clip_path"><ellipse cx="67.3094" cy="5.17269" rx="4.17269" ry="4.17269"/></clipPath><clipPath id="paint5_diamond_2141_2791_clip_path"><ellipse cx="85.7977" cy="25.5598" rx="4.17269" ry="4.17269"/></clipPath><linearGradient id="paint0_linear_2141_2791" x1="82.7482" y1="25.9656" x2="82.7482" y2="5.31942" gradientUnits="userSpaceOnUse">
                  <stop offset="0.0104167" stopColor="#FFF0DA"/>
                  <stop offset="0.0416667" stopColor="#94641E"/>
                  <stop offset="0.828125" stopColor="#FFF2DB"/>
                  <stop offset="0.9375" stopColor="#EAC885"/>
                  <stop offset="0.979167" stopColor="#FBF5D1"/>
                  <stop offset="0.9999" stopColor="#BD9A4B"/>
                  <stop offset="1" stopColor="#ECD8A3"/>
                </linearGradient>
                <linearGradient id="paint1_linear_2141_2791" x1="76.5284" y1="5.49219" x2="76.5284" y2="25.5337" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FCF6D1"/>
                  <stop offset="0.104167" stopColor="#BD9457"/>
                  <stop offset="0.25" stopColor="#E3CA89"/>
                  <stop offset="0.697917" stopColor="#FEE8C8"/>
                  <stop offset="0.854167" stopColor="#4D3A1A"/>
                  <stop offset="1" stopColor="#FCF0D1"/>
                </linearGradient>
                <linearGradient id="paint2_linear_2141_2791" x1="82.7482" y1="25.9656" x2="82.7482" y2="5.31942" gradientUnits="userSpaceOnUse">
                  <stop offset="0.0104167" stopColor="#FFF0DA"/>
                  <stop offset="0.0416667" stopColor="#94641E"/>
                  <stop offset="0.828125" stopColor="#FFF2DB"/>
                  <stop offset="0.9375" stopColor="#EAC885"/>
                  <stop offset="0.979167" stopColor="#FBF5D1"/>
                  <stop offset="0.9999" stopColor="#BD9A4B"/>
                  <stop offset="1" stopColor="#ECD8A3"/>
                </linearGradient>
                <linearGradient id="paint3_linear_2141_2791" x1="76.5284" y1="5.49219" x2="76.5284" y2="25.5337" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FCF6D1"/>
                  <stop offset="0.104167" stopColor="#BD9457"/>
                  <stop offset="0.25" stopColor="#E3CA89"/>
                  <stop offset="0.697917" stopColor="#FEE8C8"/>
                  <stop offset="0.854167" stopColor="#4D3A1A"/>
                  <stop offset="1" stopColor="#FCF0D1"/>
                </linearGradient>
                <linearGradient id="paint4_diamond_2141_2791" x1="0" y1="0" x2="500" y2="500" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white"/>
                  <stop offset="1"/>
                </linearGradient>
                <linearGradient id="paint5_diamond_2141_2791" x1="0" y1="0" x2="500" y2="500" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white"/>
                  <stop offset="1"/>
                </linearGradient>
              </defs>
            </svg>
            {/* <span className="text-black font-semibold">Deals</span> */}
          </div>
      </div>

        {/* Add Sold Car Button */}
        <div className="w-full" style={{ marginTop: '40px' }}>
          <Link 
            href="/cars/sold?modal=open"
            className="w-full mx-auto flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-400 rounded-lg text-black-600 hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => {
              console.log("Add Sold Car button clicked");
            }}
          >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          Add Sold Car
          </Link>
      </div>
      </div>

      {/* Navigation */}
        <nav 
          className="custom-scrollbar"
          style={{ 
            width: '100%', 
            flex: 1,
            marginTop: '34px',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '0 12px'
          }}>
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const isSubmenuOpen = openSubmenus.includes(item.name);

          return (
            <div key={item.name}>
              {item.submenu ? (
                <div
                  onClick={() => toggleSubmenu(item.name)}
                    style={{
                      display: 'flex',
                      padding: '14px',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      alignSelf: 'stretch',
                      borderRadius: '12px',
                      border: isActive ? '1px solid rgba(0, 0, 0, 0.24)' : 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      marginBottom: '8px',
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.icon}
                      </div>
                      <span 
                        style={{
                          color: '#000',
                          fontSize: '16px',
                          fontStyle: 'normal',
                          fontWeight: 600,
                          lineHeight: '120%',
                        }}
                      >
                        {item.name}
                  </span>
                    </div>
                    <div style={{ color: '#00000080' }}>
                      <FontAwesomeIcon 
                        icon={isSubmenuOpen ? faAngleDown : faAngleRight}
                        style={{ color: '#00000080' }}
                      />
                    </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                    style={{
                      display: 'flex',
                      padding: '14px 132px 14px 14px',
                      alignItems: 'center',
                      gap: '12px',
                      alignSelf: 'stretch',
                      borderRadius: '12px',
                      border: isActive ? '1px solid rgba(0, 0, 0, 0.24)' : 'none',
                      backgroundColor: 'transparent',
                      color: isActive ? '#000000' : '#00000080',
                      textDecoration: 'none',
                      marginBottom: '8px',
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.icon}
                    </div>
                    <span 
                      style={{
                        color: '#000',
                        fontSize: '16px',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: '120%',
                      }}
                    >
                      {item.name}
                    </span>
                </Link>
              )}

              {item.submenu && isSubmenuOpen && (
                  <div 
                    style={{ 
                      marginLeft: '32px', 
                      marginTop: '8px', 
                      marginBottom: '8px',
                      animation: 'slideDown 0.2s ease-out',
                    }}
                  >
                  {item.submenu.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                        style={{
                          display: 'block',
                          padding: '8px 12px',
                          color: pathname === subItem.href ? '#000000' : '#00000080',
                          fontSize: '16px',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          lineHeight: '120%',
                          textDecoration: 'none',
                          marginBottom: '4px',
                          transition: 'all 0.15s ease-in-out',
                          borderRadius: '6px',
                        }}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          alignSelf:'flex-start',
          marginLeft:'10px',
          marginBottom: '45px'
        }}
      >
        <div 
          style={{
            width: '45px',
            height: '45px',
            flexShrink: 0,
            borderRadius: '90px',
            background: '#00674F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          {user ? (() => {
            if (user.role === 'admin') {
              return user.name ? user.name.charAt(0).toUpperCase() : 'A';
            } else if (user.role === 'company') {
              return user.ownerName ? user.ownerName.charAt(0).toUpperCase() : 'C';
            } else if (user.role === 'subuser') {
              return user.name ? user.name.charAt(0).toUpperCase() : 'S';
            }
            return 'U';
          })() : 'U'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <span 
            style={{
              color: '#000',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '120%',
            }}
          >
            {user ? (() => {
              if (user.role === 'admin') {
                return user.name || 'Admin';
              } else if (user.role === 'company') {
                return user.ownerName || 'Company';
              } else if (user.role === 'subuser') {
                return user.name || 'Team Member';
              }
              return 'User';
            })() : 'User'}
          </span>
          <span 
            style={{
              color: '#009975',
              fontSize: '10px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '150%',
            }}
          >
            {user ? (() => {
              if (user.role === 'admin') {
                return user.email || 'admin@example.com';
              } else if (user.role === 'company') {
                return user.companyEmail || 'company@example.com';
              } else if (user.role === 'subuser') {
                return user.email || 'user@example.com';
              }
              return 'user@example.com';
            })() : 'user@example.com'}
          </span>
        </div>
        <svg 
          onClick={logout}
          xmlns="http://www.w3.org/2000/svg" 
          width="25" 
          height="25" 
          viewBox="0 0 25 25" 
          fill="none"
          style={{ cursor: 'pointer' }}
        >
          <path opacity="0.5" d="M9.14844 8.05999C9.45844 4.45999 11.3084 2.98999 15.3584 2.98999H15.4884C19.9584 2.98999 21.7484 4.77999 21.7484 9.24999V15.77C21.7484 20.24 19.9584 22.03 15.4884 22.03H15.3584C11.3384 22.03 9.48844 20.58 9.15844 17.04" stroke="#828282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2.25 12.5H15.13" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12.8984 9.15039L16.2484 12.5004L12.8984 15.8504" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
    </>
  );
}
