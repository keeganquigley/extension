import { FC } from "react";

interface LogoProps {
  fillClassName?: string;
  lineClassName?: string;
  className?: string;
}

export const Logo: FC<LogoProps> = ({
  fillClassName = "#000",
  lineClassName = "#fff",
  className,
}) => {
  return (
    <svg width="629" height="590" viewBox="0 0 629 590" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g clipPath="url(#clip0_1286_4878)">
        <g clipPath="url(#clip1_1286_4878)">
          <rect width="628.77" height="590" rx="12" fill="url(#paint0_linear_1286_4878)" />
          <path d="M44.9274 809.084C45.0651 802.699 45.5116 796.313 45.9869 789.929C46.5809 781.949 47.1888 773.97 47.8091 765.991C48.3142 759.495 48.8231 752.998 49.3728 746.505C49.9706 739.444 50.6107 732.386 51.2449 725.327C51.7768 719.407 52.2918 713.485 52.8772 707.57C53.6539 699.722 54.477 691.878 55.3078 684.036C56.0663 676.875 56.839 669.716 57.6475 662.56C58.4047 655.86 59.1957 649.164 60.0115 642.471C60.7859 636.118 61.5935 629.769 62.4196 623.423C63.408 615.831 64.3864 608.237 65.4518 600.655C66.6762 591.943 67.9596 583.239 69.2752 574.54C70.6932 565.163 72.1105 555.786 73.6526 546.43C75.306 536.398 77.0388 526.378 78.856 516.375C81.1426 503.788 83.379 491.187 85.9469 478.656C89.3859 461.874 92.9503 445.114 96.7649 428.414C105.542 389.989 115.807 351.967 128.247 314.551C135.888 291.567 144.295 268.876 154.25 246.781C156.407 241.991 158.697 237.262 160.918 232.501C161.343 231.59 161.731 230.661 162.199 229.598C161.108 229 160.067 229.224 159.111 229.056C158.098 228.878 157.079 228.733 156.061 228.587C145.904 227.126 136.258 224.085 127.22 219.197C122.056 216.405 117.342 213.008 113.384 208.636C110.119 205.03 107.623 200.977 106.304 196.252C104.388 189.393 104.957 182.682 107.489 176.086C109.74 170.221 113.283 165.2 117.725 160.824C126.331 152.346 136.549 146.795 148.409 144.405C153.842 143.31 159.292 143.196 164.722 144.659C168.458 145.666 171.669 147.518 174.452 150.169C177.211 152.797 179.385 155.864 181.224 159.181C184.916 165.84 187.148 173.013 188.688 180.429C189.783 185.704 190.267 191.05 190.587 196.417C190.628 197.096 190.661 197.776 190.711 198.705C191.452 198.531 192.088 198.47 192.653 198.236C204.321 193.405 216.517 190.452 228.867 188.059C239.645 185.972 250.517 184.497 261.435 183.426C269.055 182.68 276.707 182.24 284.347 181.718C295.876 180.93 307.426 180.767 318.973 180.85C331.777 180.942 344.573 181.334 357.35 182.341C366.926 183.096 376.482 184.003 385.99 185.339C401.507 187.519 416.869 190.432 431.732 195.549C434.643 196.551 437.506 197.694 440.405 198.777C441.343 198.284 440.974 197.373 440.992 196.648C441.193 188.488 442.456 180.494 444.749 172.67C446.36 167.171 448.512 161.891 451.568 157.012C453.153 154.482 454.982 152.149 457.146 150.085C460.648 146.743 464.823 144.847 469.586 144.051C476.069 142.967 482.371 143.872 488.541 145.748C498.453 148.761 507.11 153.961 514.356 161.397C519.457 166.632 523.366 172.618 525.213 179.782C527.775 189.725 526.043 198.803 519.61 206.895C516.15 211.248 511.873 214.654 507.162 217.54C499.788 222.058 491.814 225.142 483.413 227.058C478.858 228.096 474.212 228.739 469.452 229.587C469.568 229.972 469.657 230.52 469.891 230.998C484.905 261.632 496.639 293.551 507.007 325.995C516.501 355.703 524.626 385.792 531.892 416.119C537.055 437.671 541.841 459.307 546.047 481.062C549.799 500.463 553.264 519.921 556.611 539.397C559.242 554.709 561.606 570.069 563.894 585.437C565.745 597.869 567.357 610.337 568.98 622.801C570.559 634.927 572.078 647.061 573.51 659.205C574.608 668.512 575.552 677.837 576.525 687.159C577.594 697.39 578.649 707.623 579.65 717.86C580.251 724.004 580.741 730.158 581.276 736.307C581.87 743.14 582.485 749.972 583.045 756.807C583.605 763.644 584.13 770.483 584.63 777.324C585.281 786.217 585.894 795.113 586.514 804.009C586.617 805.492 586.674 806.979 586.745 808.774C406.241 809.084 225.745 809.084 44.9274 809.084ZM366.416 388.08C353.224 383.176 339.501 380.957 325.521 380.253C314.433 379.695 303.357 379.98 292.33 381.511C283.139 382.787 274.119 384.742 265.404 387.957C260.68 389.7 256.13 391.829 251.94 394.659C248.987 396.652 246.279 398.918 244.174 401.834C240.044 407.551 240.047 413.571 244.195 419.294C245.958 421.727 248.158 423.711 250.574 425.47C253.634 427.698 256.932 429.505 260.385 431.047C271.341 435.942 282.916 438.423 294.753 439.88C298.606 440.354 302.478 440.681 306.316 441.248C308.712 441.603 310.918 442.559 312.683 444.443C312.724 444.98 312.785 445.545 312.808 446.112C313.08 452.736 313.241 459.367 313.651 465.982C313.918 470.308 314.524 474.615 315.039 478.923C315.092 479.368 315.557 479.763 316.114 480.614C316.49 478.65 316.91 477.214 317.018 475.755C317.541 468.69 318.003 461.621 318.436 454.55C318.597 451.927 318.767 449.289 318.664 446.669C318.577 444.452 319.686 443.337 321.481 442.485C324.111 441.234 326.903 440.771 329.77 440.561C339.479 439.85 349.055 438.312 358.424 435.648C365.141 433.739 371.651 431.288 377.659 427.651C380.409 425.987 382.988 424.103 385.224 421.784C392.166 414.585 392.173 406.514 385.255 399.343C383.179 397.191 380.82 395.395 378.284 393.823C374.68 391.591 370.881 389.76 366.416 388.08ZM464.219 208.768C468.686 211.231 473.542 211.796 478.477 211.255C483.228 210.733 487.876 209.519 492.315 207.711C494.417 206.854 496.459 205.778 498.382 204.569C502.621 201.904 505.677 198.055 508.256 193.861C509.993 191.034 511.091 187.911 511.247 184.525C511.432 180.487 510.097 176.846 507.974 173.564C504.928 168.855 501.21 164.718 496.555 161.475C493.881 159.612 490.953 158.282 487.779 157.908C482.3 157.262 477.166 158.325 472.554 161.657C470.208 163.351 468.37 165.518 466.275 167.44C464.399 169.159 463.046 171.257 461.886 173.5C458.475 180.098 456.513 187.028 457.038 194.53C457.428 200.086 459.271 204.951 464.219 208.768ZM132.391 163.619C131.828 164.006 131.172 164.307 130.719 164.796C129.327 166.296 128.067 167.919 126.657 169.4C124.657 171.501 123.229 173.953 122.065 176.568C120.994 178.972 120.046 181.505 120.187 184.128C120.365 187.423 121.346 190.56 123.036 193.487C124.707 196.382 127.127 198.665 129.046 201.349C129.364 201.794 129.922 202.064 130.357 202.43C133.354 204.953 136.729 206.765 140.392 208.168C144.571 209.77 148.886 210.773 153.289 211.27C156.212 211.601 159.175 211.4 162.118 210.733C167.167 209.589 170.809 206.86 172.737 202.029C173.84 199.264 174.532 196.421 174.363 193.366C174.18 190.076 174.587 186.745 173.562 183.523C173.113 182.112 172.685 180.693 172.211 179.289C169.559 171.445 164.745 165.34 157.733 160.877C153.136 157.952 148.123 157.083 142.966 158.017C139.167 158.706 135.621 160.483 132.391 163.619ZM384.509 300.677C385.436 301.318 386.29 302.125 387.303 302.569C391.476 304.398 396.357 302.295 397.967 298.069C399.547 293.925 397.535 289.251 393.472 287.626C389.209 285.921 384.469 288 382.854 292.283C381.753 295.203 382.296 297.852 384.509 300.677ZM234.419 290.557C233.596 291.702 233.199 292.996 233.078 294.388C232.749 298.155 234.798 301.412 238.322 302.718C241.663 303.956 245.359 302.891 247.528 300.063C249.74 297.18 249.736 293.045 247.518 290.184C245.275 287.29 241.323 286.17 237.987 287.695C236.783 288.246 235.809 289.298 234.419 290.557Z" fill="white" />
          <path d="M366.66 388.188C370.881 389.76 374.68 391.591 378.284 393.823C380.82 395.395 383.179 397.191 385.255 399.343C392.173 406.514 392.166 414.585 385.224 421.784C382.988 424.103 380.409 425.987 377.659 427.651C371.651 431.288 365.141 433.739 358.424 435.648C349.055 438.312 339.479 439.85 329.77 440.561C326.903 440.771 324.111 441.234 321.481 442.484C319.686 443.337 318.577 444.452 318.664 446.669C318.767 449.289 318.597 451.927 318.436 454.55C318.003 461.621 317.541 468.69 317.018 475.755C316.91 477.214 316.49 478.65 316.114 480.614C315.557 479.763 315.092 479.368 315.039 478.923C314.524 474.615 313.918 470.308 313.651 465.982C313.241 459.367 313.08 452.736 312.808 446.112C312.785 445.545 312.724 444.98 312.683 444.443C310.918 442.559 308.712 441.602 306.316 441.248C302.478 440.681 298.606 440.354 294.753 439.88C282.916 438.423 271.341 435.942 260.385 431.047C256.932 429.505 253.634 427.698 250.574 425.47C248.158 423.711 245.958 421.727 244.195 419.294C240.047 413.571 240.044 407.551 244.174 401.834C246.279 398.918 248.987 396.652 251.94 394.658C256.13 391.829 260.68 389.7 265.404 387.957C274.119 384.742 283.139 382.787 292.33 381.511C303.357 379.98 314.433 379.694 325.521 380.253C339.501 380.957 353.224 383.176 366.66 388.188Z" fill="#010101" />
          <path d="M463.989 208.656C459.271 204.951 457.428 200.086 457.038 194.53C456.513 187.028 458.475 180.098 461.886 173.5C463.046 171.257 464.4 169.159 466.275 167.439C468.371 165.518 470.208 163.351 472.554 161.657C477.166 158.325 482.3 157.262 487.779 157.908C490.953 158.282 493.881 159.612 496.555 161.475C501.21 164.718 504.928 168.855 507.974 173.564C510.097 176.846 511.432 180.487 511.247 184.525C511.092 187.911 509.994 191.034 508.256 193.861C505.678 198.055 502.621 201.904 498.383 204.569C496.46 205.778 494.417 206.854 492.315 207.711C487.876 209.519 483.228 210.733 478.477 211.255C473.542 211.796 468.686 211.231 463.989 208.656Z" fill="#FFCDD9" />
          <path d="M132.579 163.459C135.621 160.483 139.167 158.706 142.966 158.017C148.123 157.083 153.136 157.952 157.733 160.877C164.745 165.34 169.559 171.445 172.211 179.29C172.685 180.693 173.113 182.112 173.562 183.523C174.587 186.745 174.181 190.076 174.363 193.366C174.532 196.421 173.84 199.264 172.737 202.029C170.809 206.86 167.167 209.589 162.118 210.733C159.175 211.4 156.212 211.601 153.289 211.271C148.886 210.773 144.571 209.77 140.392 208.168C136.73 206.765 133.354 204.953 130.357 202.43C129.922 202.064 129.364 201.794 129.046 201.349C127.127 198.665 124.707 196.382 123.036 193.487C121.346 190.56 120.365 187.423 120.187 184.128C120.046 181.505 120.994 178.972 122.065 176.568C123.229 173.953 124.657 171.501 126.657 169.4C128.067 167.919 129.327 166.296 130.719 164.796C131.172 164.307 131.828 164.006 132.579 163.459Z" fill="#FFCDD9" />
          <path d="M384.342 300.479C382.296 297.852 381.753 295.203 382.854 292.283C384.469 288 389.209 285.921 393.472 287.626C397.535 289.251 399.547 293.925 397.967 298.069C396.357 302.295 391.476 304.398 387.303 302.569C386.29 302.125 385.436 301.318 384.342 300.479Z" fill="#010101" />
          <path d="M234.574 290.339C235.809 289.298 236.783 288.246 237.987 287.695C241.323 286.17 245.275 287.29 247.518 290.184C249.736 293.045 249.74 297.18 247.528 300.063C245.359 302.891 241.663 303.956 238.322 302.718C234.798 301.412 232.749 298.155 233.078 294.388C233.199 292.996 233.596 291.702 234.574 290.339Z" fill="#010101" />
          <path d="M560.685 224.402L560.824 228.171C560.91 230.476 562.76 232.325 565.065 232.41L568.944 232.552L565.065 232.693C562.76 232.778 560.91 234.627 560.824 236.932L560.685 240.701L560.545 236.932C560.46 234.627 558.61 232.778 556.304 232.693L552.426 232.552L556.304 232.41C558.61 232.325 560.46 230.476 560.545 228.171L560.685 224.402Z" fill="white" fillOpacity="0.71" />
          <path d="M397.249 51.4775L397.581 60.4406C397.784 65.9241 402.184 70.3218 407.668 70.5222L416.893 70.8594L407.668 71.1966C402.184 71.397 397.784 75.7947 397.581 81.2783L397.249 90.2413L396.917 81.2783C396.714 75.7947 392.314 71.397 386.83 71.1966L377.605 70.8594L386.83 70.5222C392.314 70.3218 396.714 65.9241 396.917 60.4406L397.249 51.4775Z" fill="white" fillOpacity="0.71" />
          <path d="M64.5926 391.503L64.9247 400.466C65.128 405.95 69.5279 410.348 75.0115 410.548L84.2363 410.885L75.0115 411.222C69.5279 411.423 65.128 415.821 64.9247 421.304L64.5926 430.267L64.2604 421.304C64.0571 415.821 59.6572 411.423 54.1736 411.222L44.9489 410.885L54.1736 410.548C59.6572 410.348 64.0571 405.95 64.2604 400.466L64.5926 391.503Z" fill="white" fillOpacity="0.71" />
        </g>
        <rect x="5" y="5" width="618.77" height="580" rx="290" stroke="#FFFDFD" strokeWidth="10" />
      </g>
      <defs>
        <linearGradient id="paint0_linear_1286_4878" x1="286.249" y1="144.884" x2="424.614" y2="1003.72" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6C387A" />
          <stop offset="1" stopColor="#6C387A" stopOpacity="0" />
        </linearGradient>
        <clipPath id="clip0_1286_4878">
          <rect width="628.77" height="590" fill="white" />
        </clipPath>
        <clipPath id="clip1_1286_4878">
          <rect width="628.77" height="590" rx="295" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
