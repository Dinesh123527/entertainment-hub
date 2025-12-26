import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import { useRef, useState } from "react";
import { img_500 } from "../../config/config";
import "./ScreenshotCard.css";

const ScreenshotCard = ({ content, onClose }) => {
    const cardRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState("dark");

    const styles = [
        { id: "dark", label: "Dark", bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" },
        { id: "purple", label: "Purple", bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
        { id: "sunset", label: "Sunset", bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
        { id: "ocean", label: "Ocean", bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
        { id: "forest", label: "Forest", bg: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" },
    ];

    const downloadCard = async () => {
        if (!cardRef.current) return;

        try {
            const html2canvas = (await import("html2canvas")).default;
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2,
            });

            const link = document.createElement("a");
            link.download = `${content.title || content.name}-storyflix.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (error) {
            console.error("Error generating screenshot:", error);
            alert("Please install html2canvas: npm install html2canvas");
        }
    };

    const copyToClipboard = async () => {
        if (!cardRef.current) return;

        try {
            const html2canvas = (await import("html2canvas")).default;
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2,
            });

            canvas.toBlob(async (blob) => {
                await navigator.clipboard.write([
                    new ClipboardItem({ "image/png": blob })
                ]);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        } catch (error) {
            console.error("Error copying:", error);
        }
    };

    const shareCard = async () => {
        if (!navigator.share) {
            copyToClipboard();
            return;
        }

        try {
            const html2canvas = (await import("html2canvas")).default;
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2,
            });

            canvas.toBlob(async (blob) => {
                const file = new File([blob], `${content.title}-storyflix.png`, { type: "image/png" });
                await navigator.share({
                    title: content.title || content.name,
                    text: `Check out ${content.title || content.name} on Story Flix! ⭐ ${content.vote_average?.toFixed(1)}`,
                    files: [file],
                });
            });
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    const currentStyle = styles.find(s => s.id === selectedStyle);

    return (
        <div className="screenshot-overlay" onClick={onClose}>
            <div className="screenshot-modal" onClick={(e) => e.stopPropagation()}>
                <button className="screenshot-close" onClick={onClose}>
                    <CloseIcon />
                </button>

                <h3 className="screenshot-title">
                    <CameraAltIcon /> Create Shareable Card
                </h3>

                {/* Style Selector */}
                <div className="style-selector">
                    {styles.map((style) => (
                        <button
                            key={style.id}
                            className={`style-btn ${selectedStyle === style.id ? "active" : ""}`}
                            style={{ background: style.bg }}
                            onClick={() => setSelectedStyle(style.id)}
                            title={style.label}
                        />
                    ))}
                </div>

                {/* Preview Card */}
                <div
                    className="screenshot-card"
                    ref={cardRef}
                    style={{ background: currentStyle.bg }}
                >
                    <div className="sc-content">
                        <img
                            src={`${img_500}/${content.poster_path}`}
                            alt={content.title || content.name}
                            className="sc-poster"
                            crossOrigin="anonymous"
                        />
                        <div className="sc-info">
                            <h2 className="sc-name">{content.title || content.name}</h2>
                            <div className="sc-meta">
                                <span className="sc-rating">⭐ {content.vote_average?.toFixed(1)}</span>
                                <span className="sc-year">
                                    {(content.release_date || content.first_air_date)?.split("-")[0]}
                                </span>
                            </div>
                            <p className="sc-overview">
                                {content.overview?.length > 120
                                    ? `${content.overview.substring(0, 120)}...`
                                    : content.overview}
                            </p>
                            <div className="sc-branding">
                                📺 Story Flix
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="screenshot-actions">
                    <button className="screenshot-btn" onClick={downloadCard}>
                        <DownloadIcon /> Download
                    </button>
                    <button className="screenshot-btn" onClick={copyToClipboard}>
                        <ContentCopyIcon /> {copied ? "Copied!" : "Copy"}
                    </button>
                    <button className="screenshot-btn primary" onClick={shareCard}>
                        <ShareIcon /> Share
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScreenshotCard;
