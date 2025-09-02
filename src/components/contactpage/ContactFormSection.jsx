import React from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import { FaInstagram, FaEnvelope, FaFacebook, FaDrawPolygon } from 'react-icons/fa';

const ContactFormSection = () => {
    return (
        <section className="relative py-20 px-phone md:px-tab lg:px-desktop bg-bg-lightyellow rounded-3xl mt-10 overflow-hidden">

            <div className="absolute inset-0 flex items-center justify-center text-s2/10 z-0">
                <FaDrawPolygon size={800} />
            </div>

            <div className="relative z-10 container mx-auto grid md:grid-cols-2 gap-x-16 gap-y-12">

                <ScrollReveal>
                    <div className="space-y-6">
                        <h2 className="text-h2-phone md:text-h2-tab font-bold text-primary leading-tight">Let's Get In Touch</h2>
                        <p className="text-dark-gray text-lg">
                            We'd love to hear from you! Whether you're curious about starting a community energy project, have questions about EnTranC, or just want to say hi—drop us a message.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <a href="#" className="bg-s2 text-m-s2 p-4 rounded-xl text-2xl hover:scale-110 transition-transform"><FaInstagram /></a>
                            <a href="#" className="bg-s2 text-m-s2 p-4 rounded-xl text-2xl hover:scale-110 transition-transform"><FaFacebook /></a>
                            <a href="#" className="bg-s2 text-m-s2 p-4 rounded-xl text-2xl hover:scale-110 transition-transform"><FaEnvelope /></a>
                        </div>
                        <div className="rounded-2xl overflow-hidden shadow-lg mt-8">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2685.398625232924!2d11.25522801563303!3d47.69629897919098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479cf53610991307%3A0x253900971841a141!2sBavaria!5e0!3m2!1sen!2sde!4v1678283123456!5m2!1sen!2sde"
                                className="w-full h-80 border-0"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="EnTranC Location Map"
                            ></iframe>
                        </div>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold text-primary mb-8">Drop A Message</h3>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-base font-semibold text-primary mb-2">Name</label>
                                <input type="text" id="name" className="w-full p-4 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-s2 focus:bg-white" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-base font-semibold text-primary mb-2">Email</label>
                                <input type="email" id="email" className="w-full p-4 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-s2 focus:bg-white" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-base font-semibold text-primary mb-2">Your Message</label>
                                <textarea id="message" rows="5" className="w-full p-4 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-s2 focus:bg-white"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-m-s2 text-white font-bold py-4 rounded-xl text-lg hover:bg-yellow-800 transition-colors">
                                Submit
                            </button>
                        </form>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default ContactFormSection;
