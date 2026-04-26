import imgGroup4273200201 from "./55c72bbf9392712faf976543217fe402213c814c.png";
import imgGroup4273200131 from "./2b67c20eea0beb68f980e0a2183fd1c370c263db.png";
import imgGroup4273200141 from "./a95f7e385d0b25bf47ba2d7a7f50cc074bee3c7d.png";

function ImageContainer() {
  return (
    <div className="absolute contents left-[716px] top-[861px]" data-name="Image Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[106px] leading-[24px] left-[717px] not-italic text-[#616161] text-[15px] top-[1346px] tracking-[-0.45px] w-[420px]">We assemble the right mix of people around your product — plugging in where needed and scaling back when it’s not.</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[716px] not-italic text-[#013439] text-[24px] top-[1297px] tracking-[-0.72px] whitespace-nowrap">Flexible assembly</p>
      <div className="absolute h-[396px] left-[716px] top-[861px] w-[488px]" data-name="Group 427320020 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgGroup4273200201} />
      </div>
    </div>
  );
}

function TextContainer() {
  return (
    <div className="absolute contents font-['Inter:Medium',sans-serif] font-medium left-[1385px] not-italic top-[1060px]" data-name="Text Container">
      <p className="absolute h-[106px] leading-[24px] left-[1386px] text-[#616161] text-[15px] top-[1109px] tracking-[-0.45px] w-[420px]">We turn ideas into real, testable prototypes so teams can validate decisions, reduce uncertainty, and move faster.</p>
      <p className="absolute leading-[normal] left-[1385px] text-[#013439] text-[24px] top-[1060px] tracking-[-0.72px] whitespace-nowrap">Prototype-first delivery</p>
    </div>
  );
}

function ImageContainer1() {
  return (
    <div className="absolute contents left-[1385px] top-[624px]" data-name="Image Container">
      <TextContainer />
      <div className="absolute h-[396px] left-[1386px] top-[624px] w-[488px]" data-name="Group 427320013 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgGroup4273200131} />
      </div>
    </div>
  );
}

function TextContainer1() {
  return (
    <div className="absolute contents font-['Inter:Medium',sans-serif] font-medium left-[39px] not-italic top-[981px]" data-name="Text Container">
      <p className="absolute h-[106px] leading-[24px] left-[40px] text-[#616161] text-[15px] top-[1030px] tracking-[-0.45px] w-[420px]">A team of experienced product designers, directly involved from direction to execution.</p>
      <p className="absolute leading-[normal] left-[39px] text-[#013439] text-[24px] top-[981px] tracking-[-0.72px] whitespace-nowrap">Senior-only team</p>
    </div>
  );
}

function ImageContainer2() {
  return (
    <div className="absolute contents left-[39px] top-[545px]" data-name="Image Container">
      <TextContainer1 />
      <div className="absolute h-[396px] left-[39px] top-[545px] w-[488px]" data-name="Group 427320014 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgGroup4273200141} />
      </div>
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white relative size-full" data-name="Container">
      <div className="-translate-x-1/2 absolute bg-[rgba(228,222,219,0.6)] h-[1762px] left-1/2 top-0 w-[1920px]" data-name="Background" />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%-762px)] not-italic text-[#013439] text-[68px] top-[223px] tracking-[-3px] w-[1170px]">{`Most teams don’t need more design. `}</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%-921px)] not-italic text-[#013439] text-[68px] top-[311px] tracking-[-3px] w-[1170px]">They need the right team.</p>
      <ImageContainer />
      <ImageContainer1 />
      <ImageContainer2 />
    </div>
  );
}