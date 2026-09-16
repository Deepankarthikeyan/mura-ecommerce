"use client"
import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Link from 'next/link';
import {categories} from "@/data/featuredCategory"

const FeaturedCategories = () => {
    return (
        <div className="rts-category-area rts-section-gap">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="cover-card-main-over">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="title-area-between">
                                        <h2 className="title-left mb--0">Featured Categories</h2>
                                        <div className="next-prev-swiper-wrapper">
                                            <div className="swiper-button-prev"><i className="fa-regular fa-chevron-left"></i></div>
                                            <div className="swiper-button-next"><i className="fa-regular fa-chevron-right"></i></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="rts-caregory-area-one">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="category-area-main-wrapper-one">
                                                    <Swiper
                                                        modules={[Navigation]}
                                                        navigation={{
                                                            nextEl: '.swiper-button-next',
                                                            prevEl: '.swiper-button-prev',
                                                        }}
                                                        loop={true}
                                                        speed={1000}
                                                        spaceBetween={15}
                                                        slidesPerView={8}
                                                        breakpoints={{
                                                            0: { slidesPerView: 1, spaceBetween: 15 },
                                                            340: { slidesPerView: 2, spaceBetween: 15 },
                                                            480: { slidesPerView: 3, spaceBetween: 15 },
                                                            640: { slidesPerView: 4, spaceBetween: 15 },
                                                            840: { slidesPerView: 4, spaceBetween: 15 },
                                                            1140: { slidesPerView: 6, spaceBetween: 15 },
                                                            1740: { slidesPerView: 8, spaceBetween: 15 },
                                                        }}
                                                    >
                                                        {categories.map((category, index) => (
                                                            <SwiperSlide key={index}>
                                                                <div className="single-category-one height-180">
                                                                    <Link href="/shop">
                                                                        <Image src={category.img} alt="category" width={100} height={100} />
                                                                        <p>{category.title}</p>
                                                                        <span>{category.items}</span>
                                                                    </Link>
                                                                </div>
                                                            </SwiperSlide>
                                                        ))}
                                                    </Swiper>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedCategories;
