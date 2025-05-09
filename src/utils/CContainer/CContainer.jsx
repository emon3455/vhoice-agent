/* eslint-disable react/prop-types */

const CContainer = ({children, className}) => {
    return (
        <section className={`container mx-auto ${className}`} >
            {children}
        </section>
    );
};

export default CContainer;