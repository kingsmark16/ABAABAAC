import { useCallback, useState } from "react"

export const useGalleryState = (mediaItemsLength: number) => {

    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const goToPrevious = useCallback(() => {
        if(!mediaItemsLength) return;
        setActiveIndex((prev) => (prev - 1 + mediaItemsLength) % mediaItemsLength)
    }, [mediaItemsLength]);

    const goToNext = useCallback(() => {
        if(!mediaItemsLength) return;
        setActiveIndex((prev) => (prev + 1) % mediaItemsLength);
    }, [mediaItemsLength]);

    const openAt = useCallback((index: number) => {
        setActiveIndex(index);
        setIsOpen(true);
    }, []);

    return { isOpen, setIsOpen, activeIndex, setActiveIndex, goToPrevious, goToNext, openAt}

}