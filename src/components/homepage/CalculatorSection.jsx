import React from 'react';

const CalculatorSection = () => {
    return (
        <section className="py-20 px-phone md:px-tab lg:px-desktop bg-white">
            <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                     <h2 className="text-h2-phone md:text-h2-tab lg:text-h2-desktop font-bold leading-tight text-primary">
                        Calculate Your Energy Community's Impact
                    </h2>
                     <p className="text-dark-gray">Estimate the financial, environmental, and social benefits of going local with your energy.</p>
                </div>
                 <div className="relative rounded-2xl bg-gray-100 p-8 flex items-center justify-center min-h-[400px]">
                     <img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" className="w-full h-auto opacity-30" alt="calculator preview"/>
                     <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                        <button className="bg-primary text-white font-bold py-4 px-8 rounded-lg">Click To Open Calculator</button>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default CalculatorSection;