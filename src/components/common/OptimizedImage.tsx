import { useState, type CSSProperties } from "react";

type ImageSource = {
    srcSet: string;
    type: "image/avif" | "image/webp";
};

type OptimizedImageProps = {
    src: string;
    alt: string;
    width: number;
    height: number;

    sources?: ImageSource[];
    srcSet?: string;
    sizes?: string;

    className?: string;
    pictureClassName?: string;

    priority?: boolean;
    objectFit?: CSSProperties["objectFit"];
    objectPosition?: CSSProperties["objectPosition"];
};

export default function OptimizedImage({
    src,
    alt,
    width,
    height,
    sources = [],
    srcSet,
    sizes,
    className = "",
    pictureClassName = "",
    priority = false,
    objectFit,
    objectPosition,
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <picture className={pictureClassName}>
            {sources.map((source) => (
                <source
                    key={source.type}
                    type={source.type}
                    srcSet={source.srcSet}
                    sizes={sizes}
                />
            ))}

            <img
                src={src}
                srcSet={srcSet}
                sizes={srcSet ? sizes : undefined}
                alt={alt}
                width={width}
                height={height}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "auto"}
                decoding="async"
                onLoad={() => setIsLoaded(true)}
                className={[
                    "transition-opacity duration-300",
                    isLoaded ? "opacity-100" : "opacity-90",
                    className,
                ]
                    .filter(Boolean)
                    .join(" ")}
                style={{
                    objectFit,
                    objectPosition,
                    backgroundColor: "#1a1a1a",
                }}
            />
        </picture>
    );
}