\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{resume}[My custom CV class]
\LoadClass[paper=a4,fontsize=10pt]{article}
\RequirePackage{titlesec}
\RequirePackage{xcolor}
\RequirePackage{xhfill}
\RequirePackage{hyperref}

% No pagenumbers/headers/footers
\pagestyle{empty}

%--COLORS-----------------------------------------------------
\definecolor{lightGray}{HTML}{EFEFEF}
\definecolor{flashyGreen}{HTML}{00FF00}
\definecolor{lavenderBlue}{HTML}{C9DAF8}
\definecolor{queenPink}{HTML}{ead1dc}
\definecolor{black}{HTML}{000000}
\definecolor{white}{HTML}{ffffff}
%--COLORS----------------------------------------------------

\usepackage{xhfill}

\renewcommand{\labelitemi}{$\bullet$}

\newcommand\ruleafter[1]{#1~~\xhrulefill{black}{0.5em}} % add rule after title

\newcommand{\jobPosition}[1]{
  \Large \textbf \colorbox{flashyGreen}{#1} \xhrulefill{black}{0.5em}
}

\titleformat{\section}
  {\large\bfseries}
  {}{0em}
  {}
  []

\titleformat{\subsection}
  {\large\scshape\raggedright}
  {}{0em}
  {}

\newcommand{\headerSection}[1]{\section{\texorpdfstring{#1}{}}}

\newcommand{\cvSection}[1]{\section{\texorpdfstring{\ruleafter{#1}}{}}}

\newcommand{\positionAndCompanyLine}[3]{
  \subsection{\texorpdfstring{\textbf{#1} \textit{#2} \hfill \badgeWithFontColor{black}{white}{#3}}{}}
}

\newcommand{\badge}[2]{
  \colorbox{#1}{\hspace{0.1em} #2 \hspace{0.1em}}
}

\newcommand{\badgeWithFontColor}[3]{
  \colorbox{#1}{\hspace{0.1em} \color{#2} \textbf{#3}  \hspace{0.1em}}
}

\newcommand{\project}[2]{
  \begin{flushleft}{\badge{lightGray}{#1} #2} \end{flushleft}
}

\newcommand{\techStackList}[1]{
  \begin{flushleft}{\badge{queenPink}{Tech Stack} #1}\end{flushleft}
}

\newcommand{\educationTitleLine}[2]{
  \subsection[#1]{\textbf{#1} \hfill \badgeWithFontColor{black}{white}{#2}}
}

\newcommand{\cvParagraph}[1]{
  \begin{spacing}{1.5}
    #1
  \end{spacing}
}

% if necessary breaking the page --> https://tex.stackexchange.com/questions/94699/absolutely-definitely-preventing-page-break
\newenvironment{absolutelynopagebreak}
  {\par\nobreak\vfil\penalty0\vfilneg
   \vtop\bgroup}
  {\par\xdef\tpd{\the\prevdepth}\egroup
   \prevdepth=\tpd}