import svgPaths from "./svg-mqtv51ktgp";
import imgForegroundImage from "./99413c3396b46c08e7a514fbe9d74dc2afe3b342.png";
import imgBackgroundImage from "./bcb3ff311de82b0d9adb436c780695581c22bd51.png";
import imgProfileImage1 from "./ecc192fa4213baaac273888921a1551274ec058a.png";
import { imgProfileImage } from "./svg-wzpjk";

function HeroSection() {
  return (
    <div className="-translate-x-1/2 absolute contents left-[calc(50%-18px)] not-italic text-center text-white top-[429px] whitespace-nowrap" data-name="Hero Section">
      <div className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[0] left-[calc(50%-22.5px)] text-[0px] top-[429px] tracking-[-3px]">
        <p className="mb-0 text-[72px]">
          <span className="leading-[84px]">{`Senior `}</span>
          <span className="leading-[84px]">design</span>
          <span className="leading-[84px]">{` team`}</span>
        </p>
        <p className="leading-[84px] text-[72px]">Assembled for you.</p>
      </div>
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[calc(50%-18px)] text-[24px] top-[628px]">We turn product ideas into device-ready, coded prototypes</p>
    </div>
  );
}

function Vibe() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[24px] left-[calc(50%-208.8px)] top-[calc(50%-502px)] w-[50.395px]" data-name="vibe">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50.3951 24">
        <g id="vibe">
          <path d={svgPaths.p3ab9e400} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.pf4d1e80} fill="var(--fill-0, black)" id="Vector_2" />
          <path d={svgPaths.p2bd5b200} fill="var(--fill-0, black)" id="Vector_3" />
          <path d={svgPaths.p2ed8a900} fill="var(--fill-0, black)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute bottom-1/4 left-[15.01%] right-[14.99%] top-1/4" data-name="Group">
      <div className="absolute inset-[-10%_-7.14%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 14.4">
          <g id="Group">
            <path d="M18 7.2H1.2" id="Vector" stroke="var(--stroke-0, #212121)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
            <path d="M18 1.2H1.2" id="Vector_2" stroke="var(--stroke-0, #212121)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
            <path d="M18 13.2H1.2" id="Vector_3" stroke="var(--stroke-0, #212121)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute left-[1168px] overflow-clip size-[24px] top-[86px]" data-name="Frame">
      <Group />
    </div>
  );
}

function NavigationLinks() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex font-['Inter:Medium',sans-serif] font-medium gap-[64px] items-center leading-[normal] left-[calc(50%+1px)] not-italic text-[15px] text-black top-[89px] whitespace-nowrap" data-name="Navigation Links">
      <p className="relative shrink-0">Process</p>
      <p className="relative shrink-0">Work</p>
      <p className="relative shrink-0">Team</p>
    </div>
  );
}

function Menu() {
  return (
    <div className="-translate-x-1/2 absolute contents left-[calc(50%+0.5px)] top-[65px]" data-name="Menu">
      <div className="-translate-x-1/2 absolute bg-white h-[66px] left-[calc(50%+0.5px)] rounded-[70px] top-[65px] w-[535px]" data-name="Navigation Background" />
      <Vibe />
      <Frame />
      <NavigationLinks />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[31.25%_18.75%_31.25%_18.83%]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.9875 5.99979">
        <g id="Group">
          <path d={svgPaths.p3c95d700} fill="var(--fill-0, black)" fillOpacity="0.7" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function CaretSmUp() {
  return (
    <div className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-190px_-49px] mask-size-[276px_79px] opacity-50 overflow-clip relative size-[16px]" style={{ maskImage: `url('${imgProfileImage}')` }} data-name="caret-sm-up 1">
      <Group1 />
    </div>
  );
}

function CallToAction() {
  return (
    <div className="absolute contents left-[1566px] top-[1043px]" data-name="Call To Action">
      <div className="-translate-x-1/2 absolute bg-white h-[79px] left-[calc(50%+744px)] rounded-[62px] top-[1043px] w-[276px]" data-name="Call To Action Background" />
      <div className="absolute left-[1588px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-22px_-4px] mask-size-[276px_79px] size-[75px] top-[1047px]" style={{ maskImage: `url('${imgProfileImage}')` }} data-name="Profile Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgProfileImage1} />
      </div>
      <div className="absolute flex items-center justify-center left-[1756px] size-[16px] top-[1092px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <CaretSmUp />
        </div>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[1676px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-110px_-23px] mask-size-[276px_79px] not-italic text-[16px] text-black top-[1066px] whitespace-nowrap" style={{ maskImage: `url('${imgProfileImage}')` }}>
        Schedule now
      </p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[1677px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-111px_-47px] mask-size-[276px_79px] not-italic text-[14px] text-[rgba(0,0,0,0.5)] top-[1090px] whitespace-nowrap" style={{ maskImage: `url('${imgProfileImage}')` }}>
        15 min call
      </p>
    </div>
  );
}

export default function MainContainer() {
  return (
    <div className="bg-white relative size-full" data-name="Main Container">
      <div className="absolute h-[1280px] left-0 top-[-158px] w-[1920px]" data-name="Foreground Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgForegroundImage} />
      </div>
      <div className="absolute h-[1440px] left-px top-[-223px] w-[1920px]" data-name="Background Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgBackgroundImage} />
      </div>
      <div className="absolute blur-[87px] h-[230px] left-[453px] top-[477px] w-[1016px]" style={{ backgroundImage: "linear-gradient(84.2139deg, rgb(182, 179, 64) 1.1212%, rgb(14, 146, 102) 96.092%)" }} data-name="Hero Background" />
      <HeroSection />
      <Menu />
      <CallToAction />
    </div>
  );
}