'use client';

import React, { useState } from 'react';
import HeaderFour from '@/components/header/Header';
import ShortService from '@/components/service/ShortService';
import Footer from '@/components/Footer';
import BlogGridMain from './BlogGridMain';
import Posts from '@/data/Posts.json';
import Link from 'next/link';


export default function BlogGridPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 8;

    const totalPages = Math.ceil(Posts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const currentPosts = Posts.slice(startIndex, startIndex + postsPerPage);

    return (
        <div className="demo-one">
            {/* Header */}
            <HeaderFour />

            {/* Breadcrumb Area */}
            <div className="rts-navigation-area-breadcrumb bg_light-1">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="navigator-breadcrumb-wrapper">
                                <Link href="/">Home</Link>
                                <i className="fa-regular fa-chevron-right" />
                                <a className="current" href="#">
                                    Blog Grid
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Separator */}
            <div className="section-seperator bg_light-1">
                <div className="container">
                    <hr className="section-seperator" />
                </div>
            </div>

            {/* Blog Grid Section */}
            <div className="rts-blog-area rts-section-gap bg_white bg_gradient-tranding-items">
                <div className="container">
                    <div className="row g-5">
                        {currentPosts.map((post: any, index: number) => (
                            <div
                                key={index}
                                className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                            >
                                <div className="single-blog-style-card-border">
                                    <BlogGridMain
                                        Slug={post.productId}
                                        blogImage={post.image}
                                        blogTitle={post.title}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="row mt--50">
                        <div className="col-lg-12">
                            <div className="pagination-area-main-wrappper">
                                <ul>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <li key={i}>
                                            <button
                                                className={currentPage === i + 1 ? 'active' : ''}
                                                onClick={() => setCurrentPage(i + 1)}
                                            >
                                                {(i + 1).toString().padStart(2, '0')}
                                            </button>
                                        </li>
                                    ))}
                                    {currentPage < totalPages && (
                                        <li>
                                            <button onClick={() => setCurrentPage(currentPage + 1)}>
                                                <i className="fa-regular fa-chevrons-right" />
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <ShortService />
            <Footer />
        </div>
    );
}
