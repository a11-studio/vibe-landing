import imgMartin from "@/imports/MainContainer-2/c6085f260fd9c0ba4788039a74aabfe2a7c5edce.webp";
import imgGabriel from "@/imports/MainContainer-2/99e69596bfd47f32feaf8f5fa9b959e58b0a5201.webp";
import imgMichal from "@/imports/MainContainer-2/7cdfc9cdb7fbe3d70aa2bee8d0424356fd95b0d6.webp";
import imgMichaela from "@/imports/MainContainer-2/99cf73b51a4c59b3d9120e0891819b22ba7a2ac9.webp";
import imgPatrik from "@/imports/MainContainer-2/791ff24325ad83485e0f9e7f0ccd0f68b2c07f3d.png";

export type TeamMember = {
  src: string;
  alt: string;
  name: string;
  role: string;
  /** Panoramatický záber — orez podľa Figma mask-position (~29 % zľava). */
  objectPosition?: string;
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    src: imgMartin,
    alt: "Martin Mroc",
    name: "Martin Mroc",
    role: "CEO & UX/UI Designer",
  },
  {
    src: imgGabriel,
    alt: "Gabriel Hudoba",
    name: "Gabriel Hudoba",
    role: "Consultant & UX/UI Designer",
  },
  {
    src: imgMichal,
    alt: "Michal Prekop",
    name: "Michal Prekop",
    role: "3D Artist",
  },
  {
    src: imgMichaela,
    alt: "Michaela Fias",
    name: "Michaela Fias",
    role: "Brand Designer",
    objectPosition: "34% 38%",
  },
  {
    src: imgPatrik,
    alt: "Patrik Smejkal",
    name: "Patrik Smejkal",
    role: "Product Manager",
  },
];
