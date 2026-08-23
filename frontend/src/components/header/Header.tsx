"use client";

import { useState, useEffect, useRef } from 'react';
import BackToTop from "@/components/common/BackToTop";
import Sidebar from './Sidebar';
import { useRouter } from 'next/navigation';
import HeaderTop from '@/components/header/HeaderTop';
import HeaderSearch from './HeaderSearch';
import { LegacyStyles } from '@/components/legacy/LegacyStyles';

function HeaderOne() {

    // counter down start
    useEffect(() => {
        const countDownElements = document.querySelectorAll<HTMLElement>('.countDown');
        const endDates: Date[] = [];

        countDownElements.forEach((el) => {
            const match = el.innerText.match(/([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/);
            if (!match) return;

            const end = new Date(+match[3], +match[1] - 1, +match[2], +match[4], +match[5], +match[6]);
            if (end > new Date()) {
                endDates.push(end);
                const next = calcTime(end.getTime() - new Date().getTime());
                el.innerHTML = renderDisplay(next);
            } else {
                el.innerHTML = `<p class="end">Sorry, your session has expired.</p>`;
            }
        });

        const interval = setInterval(() => {
            countDownElements.forEach((el, i) => {
                const end = endDates[i];
                if (!end) return;
                const now = new Date();
                const diff = end.getTime() - now.getTime();

                if (diff <= 0) {
                    el.innerHTML = `<p class="end">Sorry, your session has expired.</p>`;
                } else {
                    const next = calcTime(diff);
                    el.innerHTML = renderDisplay(next);
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const calcTime = (milliseconds: number) => {
        const secondsTotal = Math.floor(milliseconds / 1000);
        const days = Math.floor(secondsTotal / 86400);
        const hours = Math.floor((secondsTotal % 86400) / 3600);
        const minutes = Math.floor((secondsTotal % 3600) / 60);
        const seconds = secondsTotal % 60;
        return [days, hours, minutes, seconds].map((v) => v.toString().padStart(2, '0'));
    };

    const renderDisplay = (timeArr: string[]) => {
        return timeArr
            .map((item) => `<div class='container'><div class='a'><div>${item}</div></div></div>`)
            .join('');
    };

    // header sticky
    const [isSticky, setIsSticky] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 150) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);



    // filter search action js start
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const allSuggestions = [
        "Profitable business makes your profit Best Solution",
        "Details Profitable business makes your profit",
        "One Profitable business makes your profit",
        "Me Profitable business makes your profit",
        "Details business makes your profit",
        "Firebase business makes your profit",
        "Netlyfy business makes your profit",
        "Profitable business makes your profit",
        "Valuable business makes your profit",
        "System business makes your profit",
        "Profitables business makes your profit",
        "Content business makes your profit",
        "Dalivaring business makes your profit",
        "Staning business makes your profit",
        "Best business makes your profit",
        "cooler business makes your profit",
        "Best-one Profitable business makes your profit",
        "Super Fresh Meat",
        "Original Fresh frut",
        "Organic Fresh frut",
        "Lite Fresh frut"
    ];

    useEffect(() => {
        if (searchTerm.trim().length > 0) {
            const filtered = allSuggestions.filter(item =>
                item.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5));
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchTerm]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);



    return (
        <div className="site-header-sticky">
            <LegacyStyles />
            <header className="header-style-two header-four bg-primary-header header-primary-sticky header--fft">
                <HeaderTop />
                <HeaderSearch />
            </header>
            <BackToTop />
            <Sidebar />
        </div>
    )
}

export default HeaderOne